from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from dotenv import load_dotenv
import os
import json
import shutil
from pathlib import Path
from datetime import datetime
import uuid
import hashlib
import secrets

from models.schema import BriefRequest, RegenerateRequest, CampaignManifest
from agents.orchestrator import CampaignOrchestrator

# Load environment variables from parent directory or current directory
env_path = Path(__file__).parent.parent / '.env'
if not env_path.exists():
    env_path = Path(__file__).parent / '.env'

print(f"Loading .env from: {env_path}")
print(f".env exists: {env_path.exists()}")

# Try loading with override=True to force reload
load_dotenv(dotenv_path=env_path, override=True)

# Debug: Read file directly to see what's in it
if env_path.exists():
    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"\n.env file content (first 200 chars):\n{content[:200]}")
        print(f"\nSearching for GOOGLE_API_KEY in file: {'GOOGLE_API_KEY' in content}")

print(f"\nGOOGLE_API_KEY loaded: {os.getenv('GOOGLE_API_KEY') is not None}")
if os.getenv('GOOGLE_API_KEY'):
    print(f"GOOGLE_API_KEY value (first 10 chars): {os.getenv('GOOGLE_API_KEY')[:10]}")
else:
    print("GOOGLE_API_KEY is None or empty")

app = FastAPI(title="Campaign Generator API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = CampaignOrchestrator()

# Storage setup
STORAGE_DIR = Path("./storage")
ASSETS_DIR = STORAGE_DIR / "assets"
CAMPAIGNS_DIR = STORAGE_DIR / "campaigns"

STORAGE_DIR.mkdir(exist_ok=True)
ASSETS_DIR.mkdir(exist_ok=True)
CAMPAIGNS_DIR.mkdir(exist_ok=True)

# Users directory for simple auth storage
USERS_DIR = STORAGE_DIR / "users"
USERS_DIR.mkdir(exist_ok=True)

# ============================================
# Authentication Endpoints
# ============================================

def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    """Generate a random auth token"""
    return secrets.token_urlsafe(32)

@app.post("/api/auth/register")
async def register(request: dict):
    """Register a new user"""
    try:
        name = request.get("name", "").strip()
        email = request.get("email", "").strip().lower()
        password = request.get("password", "")
        
        # Validation
        if not name or len(name) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
        
        if not email or '@' not in email:
            raise HTTPException(status_code=400, detail="Invalid email address")
        
        if not password or len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Check if user already exists
        user_file = USERS_DIR / f"{email.replace('@', '_at_').replace('.', '_')}.json"
        if user_file.exists():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user_data = {
            "id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password_hash": hash_password(password),
            "created_at": datetime.now().isoformat(),
            "campaigns": []
        }
        
        with open(user_file, "w") as f:
            json.dump(user_data, f, indent=2)
        
        return {
            "success": True,
            "message": "Account created successfully",
            "user": {
                "id": user_data["id"],
                "name": user_data["name"],
                "email": user_data["email"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/auth/login")
async def login(request: dict):
    """Login user"""
    try:
        email = request.get("email", "").strip().lower()
        password = request.get("password", "")
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password required")
        
        # Find user
        user_file = USERS_DIR / f"{email.replace('@', '_at_').replace('.', '_')}.json"
        if not user_file.exists():
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        with open(user_file, "r") as f:
            user_data = json.load(f)
        
        # Verify password
        if user_data["password_hash"] != hash_password(password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate token
        token = generate_token()
        
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user_data["id"],
                "name": user_data["name"],
                "email": user_data["email"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# Workflow Builder Agent Endpoints
# ============================================

@app.post("/api/agents/strategy")
async def run_strategy_agent(request: dict):
    """Execute Strategy Agent"""
    try:
        user_input = request.get("input", "")
        
        prompt = f"""As a brand strategy expert, analyze this brief and create a strategic foundation:

Brief: {user_input}

Provide a strategic analysis including:
1. Core campaign concept
2. A compelling tagline
3. Target audience definition
4. 3-5 key messages
5. Brand tone recommendation
6. Recommended channels

Return as JSON with keys: core_concept, tagline, target_audience, key_messages (array), tone, channels (array)"""

        result = orchestrator.llm_tool.generate_text({
            "prompt": prompt,
            "model": "gemini-2.0-flash-exp",
            "temperature": 0.3,
            "max_tokens": 800
        })
        
        if result.get("success"):
            # Parse the response
            try:
                content = result.get("text", "")
                # Try to extract JSON from markdown code blocks
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                strategy_data = json.loads(content)
                return {"success": True, "output": strategy_data}
            except:
                # If parsing fails, return raw text
                return {"success": True, "output": {"raw_output": result.get("text")}}
        else:
            raise HTTPException(status_code=500, detail=result.get("error"))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/copywriting")
async def run_copywriting_agent(request: dict):
    """Execute Copywriting Agent"""
    try:
        user_input = request.get("input", "")
        
        prompt = f"""As a creative copywriter, create engaging social media content:

Context: {user_input}

Generate:
1. 3 compelling social media captions (under 140 characters each)
2. A clear call-to-action
3. Relevant hashtags

Return as JSON with keys: captions (array of 3 strings), cta (string), hashtags (string)"""

        result = orchestrator.llm_tool.generate_text({
            "prompt": prompt,
            "model": "gemini-2.0-flash-exp",
            "temperature": 0.7,
            "max_tokens": 500
        })
        
        if result.get("success"):
            try:
                content = result.get("text", "")
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                copy_data = json.loads(content)
                return {"success": True, "output": copy_data}
            except:
                return {"success": True, "output": {"raw_output": result.get("text")}}
        else:
            raise HTTPException(status_code=500, detail=result.get("error"))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/visual")
async def run_visual_agent(request: dict):
    """Execute Visual Design Agent - Generate Images"""
    try:
        user_input = request.get("input", "")
        
        # Create a prompt for image generation
        image_prompt = f"Professional marketing visual: {user_input}. High quality, modern, clean design, commercial photography style"
        
        print(f"\n🎨 Visual Agent - Generating images for: {user_input}")
        print(f"📝 Image prompt: {image_prompt}")
        
        # Generate 3 image variations
        images = []
        for i in range(3):
            print(f"🖼️ Generating image {i+1}/3...")
            result = orchestrator.image_tool.generate_image({
                "prompt": image_prompt,
                "size": "1024x1024",
                "seed": None,
                "n": 1
            })
            
            if result.get("success"):
                # Save image and get URL
                image_id = f"img_{uuid.uuid4().hex[:8]}"
                image_data = result.get("image_data")
                
                # Save to file
                image_path = ASSETS_DIR / f"{image_id}.png"
                import base64
                with open(image_path, "wb") as f:
                    f.write(base64.b64decode(image_data))
                
                print(f"✅ Image saved: {image_path}")
                
                # Create URL
                image_url = f"http://localhost:8000/assets/{image_id}.png"
                
                images.append({
                    "url": image_url,
                    "thumbnail": image_url,  # Same for now
                    "selected": i == 0  # First one selected by default
                })
            else:
                print(f"❌ Image generation failed: {result.get('error')}")
        
        if images:
            print(f"✅ Visual Agent complete - Generated {len(images)} images")
            return {
                "success": True,
                "output": {
                    "images": images,
                    "prompt": image_prompt,
                    "type": "visual_with_images"
                }
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate images")
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/research")
async def run_research_agent(request: dict):
    """Execute Market Research Agent"""
    try:
        user_input = request.get("input", "")
        
        # Use search tool if available
        search_query = user_input
        search_result = orchestrator.search_tool.web_search({
            "q": search_query,
            "max_results": 5
        })
        
        if search_result.get("success"):
            results = search_result.get("results", [])
            
            # Summarize findings
            prompt = f"""As a market research analyst, analyze these search results about: {user_input}

Search Results:
{json.dumps(results, indent=2)}

Provide:
1. Key market trends (3-5 points)
2. Target audience insights
3. Competitive landscape
4. Opportunities

Return as JSON with keys: trends (array), audience_insights (string), competitive_landscape (string), opportunities (array)"""

            llm_result = orchestrator.llm_tool.generate_text({
                "prompt": prompt,
                "model": "gemini-2.0-flash-exp",
                "temperature": 0.3,
                "max_tokens": 600
            })
            
            if llm_result.get("success"):
                try:
                    content = llm_result.get("text", "")
                    if "```json" in content:
                        content = content.split("```json")[1].split("```")[0].strip()
                    elif "```" in content:
                        content = content.split("```")[1].split("```")[0].strip()
                    
                    research_data = json.loads(content)
                    research_data["sources"] = results[:3]  # Add top 3 sources
                    return {"success": True, "output": research_data}
                except:
                    return {"success": True, "output": {
                        "raw_output": llm_result.get("text"),
                        "sources": results[:3]
                    }}
        else:
            raise HTTPException(status_code=500, detail="Search failed")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/media")
async def run_media_agent(request: dict):
    """Execute Media Planning Agent"""
    try:
        user_input = request.get("input", "")
        
        prompt = f"""As a media planner, create a posting schedule:

Campaign Context: {user_input}

Create:
1. A 7-day posting calendar with specific dates
2. Channel recommendations for each post
3. Best posting times
4. Content type for each slot

Return as JSON with keys: calendar (array of objects with date, channel, time, content_type), summary (string)"""

        result = orchestrator.llm_tool.generate_text({
            "prompt": prompt,
            "model": "gemini-2.0-flash-exp",
            "temperature": 0.4,
            "max_tokens": 600
        })
        
        if result.get("success"):
            try:
                content = result.get("text", "")
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                media_data = json.loads(content)
                return {"success": True, "output": media_data}
            except:
                return {"success": True, "output": {"raw_output": result.get("text")}}
        else:
            raise HTTPException(status_code=500, detail=result.get("error"))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Mount assets directory (after agent endpoints to avoid route conflicts)
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

@app.get("/")
def read_root():
    return {"message": "Campaign Generator API", "status": "running"}

@app.post("/api/generate-campaign")
async def generate_campaign(request: BriefRequest):
    """Generate campaign from brief"""
    try:
        # Generate manifest
        result = orchestrator.generate_campaign_manifest(request.brief)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error"))
        
        manifest = result["manifest"]
        
        # Execute asset generation
        manifest = orchestrator.execute_asset_generation(manifest)
        
        # Save campaign
        campaign_id = manifest["campaign_id"]
        campaign_file = CAMPAIGNS_DIR / f"{campaign_id}.json"
        
        with open(campaign_file, "w") as f:
            json.dump(manifest, f, indent=2)
        
        return {"success": True, "campaign": manifest}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaign/{campaign_id}")
async def get_campaign(campaign_id: str):
    """Get campaign by ID"""
    campaign_file = CAMPAIGNS_DIR / f"{campaign_id}.json"
    
    if not campaign_file.exists():
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    with open(campaign_file, "r") as f:
        campaign = json.load(f)
    
    return {"success": True, "campaign": campaign}

@app.post("/api/regenerate-asset")
async def regenerate_asset(request: RegenerateRequest):
    """Regenerate a specific asset"""
    try:
        # Find campaign containing this asset
        for campaign_file in CAMPAIGNS_DIR.glob("*.json"):
            with open(campaign_file, "r") as f:
                manifest = json.load(f)
            
            # Check if asset exists in this campaign
            asset_ids = [a["id"] for a in manifest.get("asset_plan", [])]
            if request.asset_id in asset_ids:
                # Regenerate
                result = orchestrator.regenerate_asset(
                    manifest, 
                    request.asset_id, 
                    request.modify_instructions
                )
                
                if not result.get("success"):
                    raise HTTPException(status_code=500, detail=result.get("error"))
                
                # Save updated manifest
                with open(campaign_file, "w") as f:
                    json.dump(result["manifest"], f, indent=2)
                
                return {"success": True, "campaign": result["manifest"]}
        
        raise HTTPException(status_code=404, detail="Asset not found")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaigns")
async def list_campaigns():
    """List all campaigns"""
    campaigns = []
    for campaign_file in CAMPAIGNS_DIR.glob("*.json"):
        with open(campaign_file, "r") as f:
            campaign = json.load(f)
            campaigns.append({
                "campaign_id": campaign["campaign_id"],
                "brief": campaign["brief"],
                "created_at": campaign["created_at"],
                "status": campaign["status"]
            })
    
    return {"success": True, "campaigns": campaigns}

@app.post("/api/export-campaign/{campaign_id}")
async def export_campaign(campaign_id: str):
    """Export campaign as ZIP"""
    import zipfile
    from io import BytesIO
    
    campaign_file = CAMPAIGNS_DIR / f"{campaign_id}.json"
    
    if not campaign_file.exists():
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    with open(campaign_file, "r") as f:
        campaign = json.load(f)
    
    # Create ZIP in memory
    zip_buffer = BytesIO()
    
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Add manifest
        zip_file.writestr("campaign_manifest.json", json.dumps(campaign, indent=2))
        
        # Add assets
        for asset in campaign.get("asset_plan", []):
            if asset.get("url"):
                asset_path = Path(asset["url"])
                if asset_path.exists():
                    zip_file.write(asset_path, f"assets/{asset_path.name}")
            
            if asset.get("content"):
                filename = f"assets/{asset['id']}.txt"
                zip_file.writestr(filename, asset["content"])
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=campaign_{campaign_id}.zip"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
