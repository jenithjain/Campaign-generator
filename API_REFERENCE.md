# API Reference

Base URL: `http://localhost:8000`

## Endpoints

### 1. Generate Campaign

**POST** `/api/generate-campaign`

Generate a complete campaign from a marketing brief.

**Request Body**:
```json
{
  "brief": "Launch a social media campaign for our new sustainable coffee brand targeting Gen Z in Mumbai for World Environment Day"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "campaign": {
    "campaign_id": "uuid-string",
    "brief": "Launch a social media campaign...",
    "created_at": "2025-10-11T17:50:00+05:30",
    "timezone": "Asia/Kolkata",
    "status": "ready",
    "strategy": {
      "core_concept": "Your Daily Brew, A Greener View",
      "tagline": "Sip Sustainably, Live Consciously",
      "target_audience": "Gen Z in Mumbai (18-25 years)...",
      "key_messages": [
        "100% sustainable sourcing",
        "Zero waste packaging",
        "Support local farmers"
      ],
      "tone": "energetic, authentic, eco-friendly",
      "channels": ["instagram", "facebook", "twitter"]
    },
    "asset_plan": [
      {
        "id": "caption_1",
        "type": "caption",
        "version": 1,
        "seed": null,
        "prompt": "Write an Instagram caption...",
        "model": "gemini-2.0-flash-exp",
        "provider": null,
        "url": null,
        "content": "🌱 Your daily brew just got greener! ☕...",
        "safety": {
          "moderation_passed": true,
          "issues": []
        },
        "tool_calls": [...]
      },
      {
        "id": "hero_image_1",
        "type": "image",
        "version": 1,
        "seed": 123456,
        "prompt": "A vibrant sustainable coffee cup...",
        "model": "stable-diffusion-xl-base-1.0",
        "provider": "huggingface",
        "url": "./storage/assets/hero_image_1.png",
        "content": null,
        "safety": {
          "moderation_passed": true,
          "issues": []
        },
        "tool_calls": [...]
      }
    ],
    "posting_calendar": [
      {
        "date": "2025-06-05",
        "channel": "instagram",
        "asset_ids": ["caption_1", "hero_image_1"],
        "caption": "🌱 Your daily brew just got greener!...",
        "requires_approval": true
      }
    ],
    "influencers": [
      {
        "name": "EcoWarriorMumbai",
        "handle": "ecowarrior_mumbai",
        "platform": "instagram",
        "followers": "45.2K",
        "engagement_rate": "4.5%",
        "contact": null,
        "outreach_draft": "Hi! We love your sustainable living content..."
      }
    ]
  }
}
```

**Error Response** (500):
```json
{
  "detail": "Error message here"
}
```

---

### 2. Get Campaign

**GET** `/api/campaign/{campaign_id}`

Retrieve a specific campaign by ID.

**Parameters**:
- `campaign_id` (path): Campaign UUID

**Response** (200 OK):
```json
{
  "success": true,
  "campaign": { /* CampaignManifest object */ }
}
```

**Error Response** (404):
```json
{
  "detail": "Campaign not found"
}
```

---

### 3. Regenerate Asset

**POST** `/api/regenerate-asset`

Regenerate a specific asset with optional modification instructions.

**Request Body**:
```json
{
  "asset_id": "caption_1",
  "modify_instructions": "Make it more playful and add emojis"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "campaign": { /* Updated CampaignManifest with regenerated asset */ }
}
```

**Notes**:
- Asset version will be incremented
- For images, a new random seed will be used
- If `modify_instructions` is provided, the prompt will be modified
- Original campaign manifest is updated

---

### 4. List Campaigns

**GET** `/api/campaigns`

Get a list of all generated campaigns.

**Response** (200 OK):
```json
{
  "success": true,
  "campaigns": [
    {
      "campaign_id": "uuid-1",
      "brief": "Launch sustainable coffee brand...",
      "created_at": "2025-10-11T17:50:00+05:30",
      "status": "ready"
    },
    {
      "campaign_id": "uuid-2",
      "brief": "New product launch for tech startup...",
      "created_at": "2025-10-11T18:30:00+05:30",
      "status": "generating"
    }
  ]
}
```

---

### 5. Export Campaign

**POST** `/api/export-campaign/{campaign_id}`

Export campaign as a ZIP file containing manifest and all assets.

**Parameters**:
- `campaign_id` (path): Campaign UUID

**Response** (200 OK):
- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename=campaign_{id}.zip`
- Body: Binary ZIP file

**ZIP Contents**:
```
campaign_{id}.zip
├── campaign_manifest.json
└── assets/
    ├── hero_image_1.png
    ├── flyer_1.png
    ├── caption_1.txt
    ├── blog_1.txt
    └── ...
```

**Error Response** (404):
```json
{
  "detail": "Campaign not found"
}
```

---

## Data Models

### CampaignManifest

```typescript
interface CampaignManifest {
  campaign_id: string;
  brief: string;
  created_at: string;  // ISO 8601 format
  timezone: string;
  status: "draft" | "generating" | "ready" | "approved";
  strategy: CampaignStrategy;
  asset_plan: Asset[];
  posting_calendar: PostingCalendarItem[];
  influencers: Influencer[];
  metadata: Record<string, any>;
}
```

### CampaignStrategy

```typescript
interface CampaignStrategy {
  core_concept: string;
  tagline: string;
  target_audience: string;
  key_messages: string[];
  tone: string;
  channels: string[];
}
```

### Asset

```typescript
interface Asset {
  id: string;
  type: "image" | "text" | "video_script" | "caption" | "blog" | "flyer";
  version: number;
  seed: number | null;
  prompt: string;
  model: string | null;
  provider: string | null;
  url: string | null;
  content: string | null;
  safety: AssetSafety;
  tool_calls: ToolCall[];
  metadata: Record<string, any>;
}
```

### AssetSafety

```typescript
interface AssetSafety {
  moderation_passed: boolean;
  issues: string[];
}
```

### ToolCall

```typescript
interface ToolCall {
  tool: "llm_text" | "image_generate" | "web_search" | "moderation" | "store_asset" | "compute_embedding";
  id: string;
  input: Record<string, any>;
  expected_output_schema: Record<string, any>;
  retry_policy: RetryPolicy;
  safety_checks: string[];
  requires_approval: boolean;
  result?: Record<string, any>;
  error?: {
    code: string;
    message: string;
  };
}
```

### RetryPolicy

```typescript
interface RetryPolicy {
  max_attempts: number;
  backoff: "exponential" | "linear";
}
```

### PostingCalendarItem

```typescript
interface PostingCalendarItem {
  date: string;  // YYYY-MM-DD
  channel: string;
  asset_ids: string[];
  caption: string | null;
  requires_approval: boolean;
}
```

### Influencer

```typescript
interface Influencer {
  name: string;
  handle: string;
  platform: string;
  followers: string;
  engagement_rate: string | null;
  contact: string | null;
  outreach_draft: string | null;
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Campaign/Asset not found |
| 500 | Internal Server Error - Generation failed |

---

## Rate Limits

The API itself has no rate limits, but underlying services do:

- **Gemini API**: 1500 requests/day (free tier)
- **Hugging Face**: ~1 request per 10 seconds
- **Tavily**: 1000 searches/month

---

## Example Usage

### JavaScript/Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// Generate campaign
const generateCampaign = async (brief) => {
  const response = await axios.post(`${API_BASE}/api/generate-campaign`, {
    brief: brief
  });
  return response.data.campaign;
};

// Regenerate asset
const regenerateAsset = async (assetId, instructions) => {
  const response = await axios.post(`${API_BASE}/api/regenerate-asset`, {
    asset_id: assetId,
    modify_instructions: instructions
  });
  return response.data.campaign;
};

// Export campaign
const exportCampaign = async (campaignId) => {
  const response = await axios.post(
    `${API_BASE}/api/export-campaign/${campaignId}`,
    {},
    { responseType: 'blob' }
  );
  
  // Download file
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campaign_${campaignId}.zip`;
  a.click();
};
```

### Python/Requests

```python
import requests

API_BASE = 'http://localhost:8000'

# Generate campaign
def generate_campaign(brief):
    response = requests.post(
        f'{API_BASE}/api/generate-campaign',
        json={'brief': brief}
    )
    return response.json()['campaign']

# Regenerate asset
def regenerate_asset(asset_id, instructions=None):
    response = requests.post(
        f'{API_BASE}/api/regenerate-asset',
        json={
            'asset_id': asset_id,
            'modify_instructions': instructions
        }
    )
    return response.json()['campaign']

# Export campaign
def export_campaign(campaign_id):
    response = requests.post(
        f'{API_BASE}/api/export-campaign/{campaign_id}',
        stream=True
    )
    
    with open(f'campaign_{campaign_id}.zip', 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
```

### cURL

```bash
# Generate campaign
curl -X POST http://localhost:8000/api/generate-campaign \
  -H "Content-Type: application/json" \
  -d '{"brief": "Launch sustainable coffee brand for Gen Z Mumbai"}'

# Get campaign
curl http://localhost:8000/api/campaign/{campaign_id}

# Regenerate asset
curl -X POST http://localhost:8000/api/regenerate-asset \
  -H "Content-Type: application/json" \
  -d '{"asset_id": "caption_1", "modify_instructions": "Make it more playful"}'

# Export campaign
curl -X POST http://localhost:8000/api/export-campaign/{campaign_id} \
  --output campaign.zip
```

---

## WebSocket Support (Future)

Currently not implemented, but planned for real-time generation updates:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/campaign/{campaign_id}');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Generation progress:', update);
};
```
