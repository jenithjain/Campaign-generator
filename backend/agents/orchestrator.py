import google.generativeai as genai
import os
import json
from typing import Dict, Any
from datetime import datetime
import uuid
import random

from models.schema import (
    CampaignManifestWrapper, CampaignManifest, ToolCall, Asset, AssetSafety
)
from tools.llm_tool import LLMTool
from tools.image_tool import ImageTool
from tools.search_tool import SearchTool
from tools.moderation_tool import ModerationTool

class CampaignOrchestrator:
    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Initialize tools
        self.llm_tool = LLMTool()
        self.image_tool = ImageTool()
        self.search_tool = SearchTool()
        self.moderation_tool = ModerationTool()
        
        self.assets_dir = os.getenv("ASSETS_DIR", "./storage/assets")
        
    def generate_campaign_manifest(self, brief: str) -> Dict[str, Any]:
        """Generate initial campaign manifest from brief"""
        
        system_prompt = """You are an autonomous Campaign-Orchestrator LLM running on Gemini-2.0-flash-exp.

Your job:
Take a short marketing brief and produce a single JSON object whose top-level key is "campaign_manifest". The JSON must exactly follow the schema and rules defined below. Return **only valid JSON** (no explanations, no extra text).

Hard rules (must be followed exactly):
1. Output JSON only. Top-level key: "campaign_manifest". Any non-JSON output = error.
2. For each asset that needs generation, include a "tool_calls" array. Every tool_call must include:
   - "tool": one of ["llm_text","image_generate","web_search","moderation","store_asset","compute_embedding"]
   - "id": unique string id
   - "input": tool-specific inputs
   - "expected_output_schema": object describing expected output keys
   - "retry_policy": { "max_attempts": 3, "backoff": "exponential" }
   - "safety_checks": array of checks (e.g., ["moderation_text","moderation_image","alignment_threshold"])
   - optional "requires_approval": true for any outreach/scheduling drafts
3. Include the full generator prompt text verbatim in each tool_call.input so the orchestrator can forward it unchanged.
4. LLM calls (llm_text) must include: model="gemini-2.0-flash-exp", temperature (0.2 for strategic outputs, 0.6 for creative outputs), max_tokens (appropriate value).
5. Image calls (image_generate) must include: provider="huggingface", prompt, size="1024x1024", seed (int|null), n (variants, default 1).
6. Web search calls (web_search) must include: q, location (if applicable), max_results.
7. For every generated asset include a compute_embedding tool_call for alignment embedding.
8. Include moderation tool_calls for every generated text and image.
9. Each asset object must include versioning fields: id, version (start at 1), seed, prompt, model/provider, url (null until stored), safety: { moderation_passed: true, issues: [] }.
10. Keep text outputs compact (captions ≤140 chars; short scripts ≤300 tokens; blog/description ≤800 tokens).
11. Do NOT include any publish/send tool calls. All outreach or scheduling must be drafts with requires_approval=true.
12. Use Asia/Kolkata timezone when computing dates if no timezone given.

Campaign Strategy Structure:
- core_concept: Main campaign theme
- tagline: Catchy campaign slogan
- target_audience: Detailed audience description
- key_messages: Array of 3-5 key messages
- tone: Brand voice (e.g., "energetic", "professional", "playful")
- channels: Array of platforms (e.g., ["instagram", "facebook", "twitter"])

Asset Types to Generate:
- 3-5 social media captions (type: "caption")
- 2-3 hero images/visuals (type: "image")
- 1 Instagram Reel script (type: "video_script")
- 1 blog post/description (type: "blog")
- 1 promotional flyer design (type: "flyer")

For each asset, create appropriate tool_calls in sequence:
1. Generation tool (llm_text or image_generate)
2. Moderation tool
3. Embedding tool (for alignment checking)

Example tool_call structure:
{
  "tool": "llm_text",
  "id": "caption_1_gen",
  "input": {
    "prompt": "Write an Instagram caption for...",
    "model": "gemini-2.0-flash-exp",
    "temperature": 0.6,
    "max_tokens": 150
  },
  "expected_output_schema": {
    "text": "string"
  },
  "retry_policy": {
    "max_attempts": 3,
    "backoff": "exponential"
  },
  "safety_checks": ["moderation_text"]
}"""

        task_prompt = f"""Brief: {brief}

Generate a complete campaign manifest following all rules. Include strategy, asset_plan with tool_calls, posting_calendar, and influencer search plan."""

        try:
            response = self.model.generate_content(
                f"{system_prompt}\n\n{task_prompt}",
                generation_config={
                    "temperature": 0.3,
                    "max_output_tokens": 8192,
                }
            )
            
            # Parse JSON response
            json_text = response.text.strip()
            # Remove markdown code blocks if present
            json_text = json_text.replace('```json', '').replace('```', '').strip()
            
            manifest_data = json.loads(json_text)
            
            # Normalize the manifest structure (handle different field names from Gemini)
            if "campaign_manifest" in manifest_data:
                campaign = manifest_data["campaign_manifest"]
                
                # Add required fields if missing
                if "campaign_id" not in campaign:
                    campaign["campaign_id"] = str(uuid.uuid4())
                if "brief" not in campaign:
                    campaign["brief"] = brief
                if "created_at" not in campaign:
                    campaign["created_at"] = datetime.now().isoformat()
                if "timezone" not in campaign:
                    campaign["timezone"] = "Asia/Kolkata"
                if "status" not in campaign:
                    campaign["status"] = "draft"
                
                # Normalize field names
                if "campaign_strategy" in campaign and "strategy" not in campaign:
                    campaign["strategy"] = campaign.pop("campaign_strategy")
                if "assets" in campaign and "asset_plan" not in campaign:
                    campaign["asset_plan"] = campaign.pop("assets")
                if "calendar" in campaign and "posting_calendar" not in campaign:
                    campaign["posting_calendar"] = campaign.pop("calendar")
                
                # Ensure required lists exist
                if "asset_plan" not in campaign:
                    campaign["asset_plan"] = []
                if "posting_calendar" not in campaign:
                    campaign["posting_calendar"] = []
                if "influencers" not in campaign:
                    campaign["influencers"] = []
                if "metadata" not in campaign:
                    campaign["metadata"] = {}
                
                manifest_data["campaign_manifest"] = campaign
            
            # Validate and create manifest
            manifest_wrapper = CampaignManifestWrapper(**manifest_data)
            
            return {
                "success": True,
                "manifest": manifest_wrapper.campaign_manifest.model_dump()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def execute_tool_call(self, tool_call: ToolCall) -> Dict[str, Any]:
        """Execute a single tool call with retry logic"""
        max_attempts = tool_call.retry_policy.max_attempts
        
        for attempt in range(max_attempts):
            try:
                if tool_call.tool == "llm_text":
                    result = self.llm_tool.generate_text(tool_call.input)
                elif tool_call.tool == "image_generate":
                    result = self.image_tool.generate_image(tool_call.input)
                elif tool_call.tool == "web_search":
                    result = self.search_tool.web_search(tool_call.input)
                elif tool_call.tool == "moderation":
                    content_type = tool_call.input.get("type", "text")
                    if content_type == "text":
                        result = self.moderation_tool.moderate_text(tool_call.input)
                    else:
                        result = self.moderation_tool.moderate_image(tool_call.input)
                elif tool_call.tool == "compute_embedding":
                    result = self.llm_tool.compute_embedding(tool_call.input)
                else:
                    result = {"success": False, "error": f"Unknown tool: {tool_call.tool}"}
                
                if result.get("success"):
                    return result
                
                # If failed and not last attempt, wait before retry
                if attempt < max_attempts - 1:
                    import time
                    wait_time = 2 ** attempt if tool_call.retry_policy.backoff == "exponential" else 2
                    time.sleep(wait_time)
                    
            except Exception as e:
                if attempt == max_attempts - 1:
                    return {"success": False, "error": str(e)}
        
        return {"success": False, "error": "Max retries exceeded"}
    
    def execute_asset_generation(self, manifest: Dict[str, Any]) -> Dict[str, Any]:
        """Execute all tool calls for all assets in the manifest"""
        
        asset_plan = manifest.get("asset_plan", [])
        
        for asset in asset_plan:
            asset_obj = Asset(**asset)
            
            for tool_call_data in asset.get("tool_calls", []):
                tool_call = ToolCall(**tool_call_data)
                
                # Execute tool call
                result = self.execute_tool_call(tool_call)
                
                # Store result
                tool_call_data["result"] = result
                
                if not result.get("success"):
                    tool_call_data["error"] = {
                        "code": "execution_failed",
                        "message": result.get("error", "Unknown error")
                    }
                
                # Update asset based on tool type
                if tool_call.tool == "llm_text" and result.get("success"):
                    asset["content"] = result.get("text")
                    asset["model"] = result.get("model")
                
                elif tool_call.tool == "image_generate" and result.get("success"):
                    # Save image
                    image_data = result.get("image_data")
                    if image_data:
                        file_path = self.image_tool.save_image(
                            image_data, 
                            asset["id"], 
                            self.assets_dir
                        )
                        asset["url"] = file_path
                        asset["provider"] = result.get("provider")
                        asset["model"] = result.get("model")
                
                elif tool_call.tool == "moderation" and result.get("success"):
                    asset["safety"]["moderation_passed"] = result.get("moderation_passed", True)
                    asset["safety"]["issues"] = result.get("issues", [])
        
        manifest["status"] = "ready"
        return manifest
    
    def regenerate_asset(self, manifest: Dict[str, Any], asset_id: str, modify_instructions: str = None) -> Dict[str, Any]:
        """Regenerate a specific asset"""
        
        asset_plan = manifest.get("asset_plan", [])
        target_asset = None
        
        for asset in asset_plan:
            if asset["id"] == asset_id:
                target_asset = asset
                break
        
        if not target_asset:
            return {"success": False, "error": "Asset not found"}
        
        # Increment version
        target_asset["version"] += 1
        
        # Generate new seed for images
        if target_asset["type"] == "image":
            target_asset["seed"] = random.randint(1, 1000000)
        
        # Modify prompt if instructions provided
        if modify_instructions:
            for tool_call in target_asset.get("tool_calls", []):
                if tool_call["tool"] in ["llm_text", "image_generate"]:
                    original_prompt = tool_call["input"]["prompt"]
                    tool_call["input"]["prompt"] = f"{original_prompt}\n\nModification: {modify_instructions}"
        
        # Re-execute tool calls for this asset
        for tool_call_data in target_asset.get("tool_calls", []):
            tool_call = ToolCall(**tool_call_data)
            result = self.execute_tool_call(tool_call)
            
            tool_call_data["result"] = result
            
            if tool_call.tool == "llm_text" and result.get("success"):
                target_asset["content"] = result.get("text")
            elif tool_call.tool == "image_generate" and result.get("success"):
                image_data = result.get("image_data")
                if image_data:
                    file_path = self.image_tool.save_image(
                        image_data, 
                        f"{asset_id}_v{target_asset['version']}", 
                        self.assets_dir
                    )
                    target_asset["url"] = file_path
        
        return {"success": True, "manifest": manifest}
