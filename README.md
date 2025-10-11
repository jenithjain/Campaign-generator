# AI Campaign Generator

An autonomous AI-powered platform that transforms marketing briefs into complete, deployment-ready brand campaigns using Gemini 2.5 Pro, Stable Diffusion, and web research tools.

## Features

- **Abstract Reasoning & Strategy Formation**: AI analyzes your brief and creates a strategic campaign concept
- **Multi-Tool Orchestration**: Automatically generates:
  - Social media captions and content
  - AI-generated visuals and graphics
  - Instagram Reel scripts
  - Blog posts and descriptions
  - Influencer recommendations
  - Posting calendar and media plan
- **Interactive Campaign Canvas**: Review, edit, and regenerate any asset
- **Export Functionality**: Download complete campaign package as ZIP

## Tech Stack

### Backend
- **Python 3.10+** with FastAPI
- **Google Gemini 2.5 Pro** (free tier) - LLM for strategy and copywriting
- **Hugging Face Inference API** (free) - Stable Diffusion XL for image generation
- **Tavily API** (free tier) - Web search for influencer discovery
- **SQLite** - Local database

### Frontend
- **React 18** with Vite
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - API calls

## Setup Instructions

### Prerequisites

1. **Python 3.10 or higher**
2. **Node.js 18 or higher**
3. **API Keys** (all free):
   - Google AI Studio (Gemini): https://aistudio.google.com/app/apikey
   - Hugging Face: https://huggingface.co/settings/tokens
   - Tavily: https://tavily.com

### Installation

1. **Clone/Navigate to project directory**
```bash
cd "d:\Campaign generator"
```

2. **Setup Backend**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**
```bash
# Copy .env.example to .env in root directory
cp ../.env.example ../.env

# Edit .env and add your API keys:
# GOOGLE_API_KEY=your_key_here
# HUGGINGFACE_API_TOKEN=your_token_here
# TAVILY_API_KEY=your_key_here
```

### Running the Application

1. **Start Backend Server** (in `backend/` directory)
```bash
# Make sure virtual environment is activated
python main.py
```
Backend will run on: http://localhost:8000

2. **Start Frontend** (in `frontend/` directory, new terminal)
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

3. **Open Browser**
Navigate to: http://localhost:5173

## Usage

1. **Enter Campaign Brief**
   - Example: "Launch a social media campaign for our new sustainable coffee brand targeting Gen Z in Mumbai for World Environment Day"

2. **Wait for Generation**
   - AI will create strategy, generate assets, and research influencers
   - This may take 1-2 minutes

3. **Review Campaign Canvas**
   - View strategy, assets, posting calendar, and influencer recommendations
   - Edit text content inline
   - Regenerate any asset with optional modification instructions

4. **Export Campaign**
   - Click "Export Campaign" to download ZIP with all assets and manifest

## Project Structure

```
Campaign generator/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── agents/
│   │   └── orchestrator.py     # Main AI orchestrator
│   ├── tools/
│   │   ├── llm_tool.py         # Gemini text generation
│   │   ├── image_tool.py       # Hugging Face image gen
│   │   ├── search_tool.py      # Tavily web search
│   │   └── moderation_tool.py  # Content safety
│   ├── models/
│   │   └── schema.py           # Pydantic schemas
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── BriefInput.jsx
│   │   │   ├── CampaignCanvas.jsx
│   │   │   ├── AssetCard.jsx
│   │   │   └── ExportButton.jsx
│   │   └── api.js
│   └── package.json
├── storage/                    # Auto-created
│   ├── assets/                 # Generated images
│   └── campaigns/              # Campaign manifests
├── .env                        # Your API keys
└── README.md
```

## API Endpoints

- `POST /api/generate-campaign` - Generate campaign from brief
- `GET /api/campaign/{campaign_id}` - Get campaign by ID
- `POST /api/regenerate-asset` - Regenerate specific asset
- `GET /api/campaigns` - List all campaigns
- `POST /api/export-campaign/{campaign_id}` - Export as ZIP

## Free Tier Limits

- **Gemini 2.5 Pro**: 1500 requests/day (free tier)
- **Hugging Face**: Rate limited, may need to wait for model loading
- **Tavily**: 1000 searches/month (free tier)

## Troubleshooting

### Hugging Face Model Loading
If you get a 503 error, the model is loading. The system will auto-retry after 20 seconds.

### API Key Issues
Ensure all API keys are correctly set in `.env` file and the file is in the root directory.

### CORS Errors
Make sure both backend (port 8000) and frontend (port 5173) are running.

## Future Enhancements

- [ ] A/B testing suggestions
- [ ] Campaign versioning
- [ ] Multi-user support
- [ ] Analytics integration
- [ ] More image generation providers
- [ ] Video generation support

## License

MIT License - Free to use and modify
