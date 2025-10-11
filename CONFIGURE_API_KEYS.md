# 🔑 API Keys Configuration

## The Issue

You're seeing a **500 Internal Server Error** because the backend requires API keys that haven't been configured yet.

## Required API Keys

The Campaign Generator needs three API keys (all have free tiers):

1. **Google AI Studio (Gemini)** - For AI text generation and strategy
2. **Hugging Face** - For AI image generation
3. **Tavily** - For web search and influencer discovery

## Step-by-Step Setup

### 1. Get Your API Keys

#### Google AI Studio (Gemini)
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

#### Hugging Face
1. Visit: https://huggingface.co/settings/tokens
2. Sign up/log in
3. Click "New token"
4. Give it a name (e.g., "Campaign Generator")
5. Select "Read" access
6. Copy the token (starts with `hf_...`)

#### Tavily
1. Visit: https://tavily.com
2. Sign up for free account
3. Go to dashboard
4. Copy your API key (starts with `tvly-...`)

### 2. Create .env File

**Option A: Using the template (Windows)**
```powershell
# In the Campaign-generator directory
Copy-Item env.template .env
```

**Option B: Using the template (Mac/Linux)**
```bash
# In the Campaign-generator directory
cp env.template .env
```

**Option C: Create manually**
1. Create a new file named `.env` in the `Campaign-generator` directory
2. Copy the content from `env.template`

### 3. Add Your API Keys

Edit the `.env` file and replace the placeholder values:

```bash
GOOGLE_API_KEY=AIzaSy...your_actual_key...
HUGGINGFACE_API_TOKEN=hf_...your_actual_token...
TAVILY_API_KEY=tvly-...your_actual_key...
```

**Important:**
- No quotes around the values
- No spaces before or after the `=`
- Make sure the file is named `.env` (not `.env.txt`)

### 4. Verify Setup

The `.env` file should look like this (with your actual keys):

```bash
GOOGLE_API_KEY=AIzaSyABCDEF1234567890...
HUGGINGFACE_API_TOKEN=hf_ABCDEFGHIJK1234567890...
TAVILY_API_KEY=tvly-ABCDEFGHIJK1234567890...
```

### 5. Restart Backend Server

If the backend is already running:
1. Press `Ctrl+C` to stop it
2. Start it again:
   ```bash
   cd backend
   python main.py
   ```

## Verification

You'll know it's working when:
1. Backend starts without errors
2. You see: "Application startup complete"
3. No "API key not found" errors in the console
4. You can generate campaigns without 500 errors

## Troubleshooting

### Still getting 500 errors?

**Check the backend console** - it will show which API key is missing:
- `GOOGLE_API_KEY not found` → Google AI Studio key missing
- `HUGGINGFACE_API_TOKEN not found` → Hugging Face token missing
- `TAVILY_API_KEY not found` → Tavily key missing

### .env file not found?

Make sure:
- File is in `Campaign-generator/` directory (not in `backend/`)
- File is named `.env` exactly (not `.env.txt`)
- File has no BOM or special characters

### API keys not working?

- Double-check you copied the entire key
- No extra spaces or line breaks
- Keys are still valid (not expired/revoked)
- You're within the free tier limits

## Security Note

⚠️ **Never commit the `.env` file to git!** 
- It's already in `.gitignore`
- These keys give access to your accounts
- Keep them private

## Free Tier Limits

- **Gemini**: 1500 requests/day
- **Hugging Face**: Rate limited (slower, but free)
- **Tavily**: 1000 searches/month

These are more than enough for testing and small-scale use!

## Next Steps

Once you have all three API keys configured:
1. Restart the backend server
2. Refresh your browser
3. Try generating a campaign
4. Should work! 🎉

## Need Help?

If you're still stuck:
1. Check the backend terminal for specific error messages
2. Verify all three API keys are set correctly
3. Make sure you're using the free tier (no payment required)
4. Try visiting the API provider sites to verify your keys work

---

**Quick Test:**
```bash
# In Campaign-generator directory
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('GOOGLE_API_KEY:', 'SET' if os.getenv('GOOGLE_API_KEY') else 'MISSING'); print('HUGGINGFACE_API_TOKEN:', 'SET' if os.getenv('HUGGINGFACE_API_TOKEN') else 'MISSING'); print('TAVILY_API_KEY:', 'SET' if os.getenv('TAVILY_API_KEY') else 'MISSING')"
```

This will tell you which keys are properly configured!

