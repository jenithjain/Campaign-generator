# System Architecture

## High-Level Flow

```
┌─────────────────┐
│  User enters    │
│  campaign brief │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         GEMINI 2.5 PRO (Campaign Strategist)        │
│  - Analyzes brief                                   │
│  - Creates strategy (concept, tagline, messages)    │
│  - Generates campaign_manifest.json with tool_calls │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│         ORCHESTRATOR (Sequential Execution)         │
│  For each asset in manifest:                        │
│    1. Execute generation tool                       │
│    2. Run moderation check                          │
│    3. Compute embedding (alignment)                 │
│    4. Store result                                  │
└────────┬────────────────────────────────────────────┘
         │
         ├──────────────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
    │ GEMINI │    │ STABLE  │    │ TAVILY  │    │  GEMINI  │
    │  LLM   │    │DIFFUSION│    │  SEARCH │    │MODERATION│
    │        │    │   XL    │    │         │    │          │
    │Captions│    │ Images  │    │Influencer│   │  Safety  │
    │Scripts │    │ Flyers  │    │ Research │   │  Checks  │
    │ Blogs  │    │         │    │         │    │          │
    └────────┘    └─────────┘    └─────────┘    └──────────┘
         │              │              │              │
         └──────────────┴──────────────┴──────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Updated Manifest     │
            │  with all assets      │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Campaign Canvas UI   │
            │  - View strategy      │
            │  - Edit assets        │
            │  - Regenerate items   │
            │  - Export package     │
            └───────────────────────┘
```

## Component Details

### 1. Frontend (React + Vite)
**Location**: `frontend/src/`

**Components**:
- `BriefInput.jsx` - User input form
- `CampaignCanvas.jsx` - Main campaign display
- `AssetCard.jsx` - Individual asset with edit/regenerate
- `ExportButton.jsx` - Download campaign ZIP

**State Flow**:
```
User Input → API Call → Loading State → Campaign Display → User Actions
```

### 2. Backend (FastAPI)
**Location**: `backend/`

**Endpoints**:
```
POST /api/generate-campaign
  ├─ Input: { brief: string }
  └─ Output: { campaign: CampaignManifest }

POST /api/regenerate-asset
  ├─ Input: { asset_id: string, modify_instructions?: string }
  └─ Output: { campaign: CampaignManifest }

GET /api/campaign/{id}
POST /api/export-campaign/{id}
GET /api/campaigns
```

### 3. AI Orchestrator
**Location**: `backend/agents/orchestrator.py`

**Process**:
```python
1. generate_campaign_manifest(brief)
   └─ Calls Gemini with system prompt
   └─ Returns campaign_manifest.json

2. execute_asset_generation(manifest)
   └─ For each asset:
      ├─ Parse tool_calls
      ├─ Execute tools sequentially
      ├─ Handle retries (exponential backoff)
      └─ Update asset with results

3. regenerate_asset(manifest, asset_id, instructions)
   └─ Increment version
   └─ Modify prompt if instructions provided
   └─ Re-execute tool_calls
```

### 4. Tool Integrations
**Location**: `backend/tools/`

#### LLM Tool (`llm_tool.py`)
```python
generate_text(input)
  ├─ Model: gemini-2.0-flash-exp
  ├─ Temperature: 0.2 (strategic) / 0.6 (creative)
  └─ Returns: { text, model, usage }

compute_embedding(input)
  ├─ Model: text-embedding-004
  └─ Returns: { embedding, dimensions }
```

#### Image Tool (`image_tool.py`)
```python
generate_image(input)
  ├─ Provider: Hugging Face
  ├─ Model: stable-diffusion-xl-base-1.0
  ├─ Handles 503 (model loading) with retry
  └─ Returns: { image_data (base64), format, model }
```

#### Search Tool (`search_tool.py`)
```python
web_search(input)
  ├─ Provider: Tavily
  ├─ Search depth: basic
  └─ Returns: { results: [{ title, url, content, score }] }
```

#### Moderation Tool (`moderation_tool.py`)
```python
moderate_text(input)
  ├─ Uses Gemini for safety analysis
  └─ Returns: { moderation_passed, issues }
```

## Data Models

### CampaignManifest Schema
```typescript
{
  campaign_id: string
  brief: string
  created_at: string
  timezone: string
  status: "draft" | "generating" | "ready" | "approved"
  
  strategy: {
    core_concept: string
    tagline: string
    target_audience: string
    key_messages: string[]
    tone: string
    channels: string[]
  }
  
  asset_plan: Asset[]
  posting_calendar: PostingCalendarItem[]
  influencers: Influencer[]
}
```

### Asset Schema
```typescript
{
  id: string
  type: "image" | "text" | "video_script" | "caption" | "blog" | "flyer"
  version: number
  seed: number | null
  prompt: string
  model: string
  provider: string
  url: string | null
  content: string | null
  
  safety: {
    moderation_passed: boolean
    issues: string[]
  }
  
  tool_calls: ToolCall[]
}
```

### ToolCall Schema
```typescript
{
  tool: "llm_text" | "image_generate" | "web_search" | "moderation" | "compute_embedding"
  id: string
  input: {
    prompt?: string
    model?: string
    temperature?: number
    max_tokens?: number
    // ... tool-specific inputs
  }
  expected_output_schema: object
  retry_policy: {
    max_attempts: number
    backoff: "exponential" | "linear"
  }
  safety_checks: string[]
  requires_approval: boolean
  result?: object
  error?: { code: string, message: string }
}
```

## Storage Structure

```
storage/
├── assets/
│   ├── asset_id_1.png
│   ├── asset_id_2.png
│   └── ...
└── campaigns/
    ├── campaign_id_1.json
    ├── campaign_id_2.json
    └── ...
```

## API Integration Points

### Free Tier Limits
- **Gemini 2.5 Pro**: 1500 requests/day
- **Hugging Face**: Rate limited, ~1 req/10s
- **Tavily**: 1000 searches/month

### Error Handling
All tools implement retry logic:
```python
max_attempts = 3
backoff = exponential  # 2s, 4s, 8s
```

### Safety Pipeline
Every generated asset goes through:
1. Generation (LLM/Image)
2. Moderation check
3. Embedding computation (for alignment)
4. Storage

If moderation fails:
- Asset marked as unsafe
- Not included in posting calendar
- User notified in UI

## Workflow Example

**User Brief**: "Launch sustainable coffee brand for Gen Z Mumbai"

**Gemini Strategy Output**:
```json
{
  "strategy": {
    "core_concept": "Your Daily Brew, A Greener View",
    "tagline": "Sip Sustainably, Live Consciously",
    "target_audience": "Gen Z in Mumbai (18-25), eco-conscious...",
    "key_messages": ["100% sustainable sourcing", "Zero waste packaging", ...],
    "tone": "energetic, authentic, eco-friendly",
    "channels": ["instagram", "twitter", "tiktok"]
  },
  "asset_plan": [
    {
      "id": "caption_1",
      "type": "caption",
      "tool_calls": [
        { "tool": "llm_text", "input": { "prompt": "Write Instagram caption..." } },
        { "tool": "moderation", ... },
        { "tool": "compute_embedding", ... }
      ]
    },
    {
      "id": "hero_image_1",
      "type": "image",
      "tool_calls": [
        { "tool": "image_generate", "input": { "prompt": "Sustainable coffee cup..." } },
        { "tool": "moderation", ... }
      ]
    }
  ]
}
```

**Orchestrator Execution**:
1. Executes `llm_text` → Gets caption
2. Runs `moderation` → Checks safety
3. Computes `embedding` → Stores vector
4. Executes `image_generate` → Gets image
5. Saves image to `storage/assets/`
6. Updates manifest with URLs and content

**User Receives**:
- Complete strategy
- 5 captions ready to post
- 3 hero images
- Reel script
- Blog post
- Influencer list with outreach drafts
- 7-day posting calendar

## Extension Points

### Adding New Tools
1. Create tool class in `backend/tools/`
2. Implement tool method
3. Add to orchestrator's `execute_tool_call()`
4. Update schema with new tool type

### Adding New Asset Types
1. Update `Asset.type` enum in schema
2. Add icon mapping in `AssetCard.jsx`
3. Create tool_calls template in orchestrator

### Custom Providers
Replace in tool files:
- Image: Swap Hugging Face for Replicate/DALL-E
- Search: Swap Tavily for SerpAPI/Brave
- LLM: Swap Gemini for Claude/GPT-4
