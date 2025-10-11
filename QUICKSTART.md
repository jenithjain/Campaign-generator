# Quick Start Guide

## Get Your FREE API Keys (5 minutes)

### 1. Google AI Studio (Gemini) - Required
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### 2. Hugging Face - Required
1. Go to: https://huggingface.co/join
2. Create free account
3. Go to: https://huggingface.co/settings/tokens
4. Click "New token" → Name it "campaign-gen" → Role: "Read"
5. Copy the token

### 3. Tavily - Required
1. Go to: https://tavily.com
2. Sign up for free account
3. Copy your API key from dashboard

## Setup (10 minutes)

### Step 1: Configure API Keys
1. Open `.env.example` file
2. Copy it and rename to `.env`
3. Paste your API keys:
```
GOOGLE_API_KEY=AIzaSy...your_key_here
HUGGINGFACE_API_TOKEN=hf_...your_token_here
TAVILY_API_KEY=tvly-...your_key_here
```

### Step 2: Install Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Install Frontend
```bash
cd ../frontend
npm install
```

## Run the App

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate
python main.py
```
✅ Backend running on http://localhost:8000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

## Test It!

1. Open browser: http://localhost:5173
2. Enter this test brief:
```
Launch a social media campaign for our new sustainable coffee brand 
targeting Gen Z in Mumbai for World Environment Day
```
3. Click "Generate Campaign"
4. Wait 1-2 minutes for AI to create your campaign!

## What You'll Get

- ✅ Complete campaign strategy
- ✅ 3-5 social media captions
- ✅ AI-generated hero images
- ✅ Instagram Reel script
- ✅ Blog post content
- ✅ Promotional flyer design
- ✅ Influencer recommendations
- ✅ Posting calendar

## Troubleshooting

### "GOOGLE_API_KEY not found"
- Make sure `.env` file is in the root directory (not in backend/)
- Check that API keys have no extra spaces

### "Model is loading" (503 error)
- Hugging Face models take 20-30 seconds to load first time
- The app will auto-retry, just wait

### Frontend won't connect to backend
- Make sure both servers are running
- Backend should be on port 8000
- Frontend should be on port 5173

## Need Help?

Check the full README.md for detailed documentation.
