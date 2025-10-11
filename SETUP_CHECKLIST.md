# Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ✅ Pre-Setup

- [ ] Python 3.10+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional, for version control)

## ✅ API Keys (Required)

### Google AI Studio (Gemini)
- [ ] Created account at https://aistudio.google.com
- [ ] Generated API key
- [ ] Copied key (starts with `AIzaSy...`)

### Hugging Face
- [ ] Created account at https://huggingface.co/join
- [ ] Generated token at https://huggingface.co/settings/tokens
- [ ] Copied token (starts with `hf_...`)

### Tavily
- [ ] Created account at https://tavily.com
- [ ] Copied API key from dashboard (starts with `tvly-...`)

## ✅ Environment Configuration

- [ ] Copied `.env.example` to `.env`
- [ ] Added `GOOGLE_API_KEY` to `.env`
- [ ] Added `HUGGINGFACE_API_TOKEN` to `.env`
- [ ] Added `TAVILY_API_KEY` to `.env`
- [ ] Verified no extra spaces in API keys
- [ ] Saved `.env` file in root directory (not in backend/)

## ✅ Backend Setup

- [ ] Navigated to `backend/` directory
- [ ] Created virtual environment (`python -m venv venv`)
- [ ] Activated virtual environment (`venv\Scripts\activate`)
- [ ] Installed dependencies (`pip install -r requirements.txt`)
- [ ] No errors during installation
- [ ] Verified imports work (`python -c "import fastapi; import google.generativeai"`)

## ✅ Frontend Setup

- [ ] Navigated to `frontend/` directory
- [ ] Installed dependencies (`npm install`)
- [ ] No errors during installation
- [ ] Verified React is installed (`npm list react`)

## ✅ Directory Structure

- [ ] `storage/` directory exists (or will be auto-created)
- [ ] `storage/assets/` directory exists (or will be auto-created)
- [ ] `storage/campaigns/` directory exists (or will be auto-created)

## ✅ First Run

### Backend
- [ ] Opened terminal in `backend/` directory
- [ ] Activated virtual environment
- [ ] Ran `python main.py`
- [ ] Saw "Application startup complete" message
- [ ] Backend running on http://localhost:8000
- [ ] Visited http://localhost:8000 in browser
- [ ] Saw `{"message": "Campaign Generator API", "status": "running"}`

### Frontend
- [ ] Opened NEW terminal in `frontend/` directory
- [ ] Ran `npm run dev`
- [ ] Saw "Local: http://localhost:5173" message
- [ ] Frontend running on http://localhost:5173
- [ ] Visited http://localhost:5173 in browser
- [ ] Saw "AI Campaign Generator" page with input form

## ✅ Test Campaign Generation

- [ ] Entered test brief in input box:
  ```
  Launch a social media campaign for our new sustainable coffee brand 
  targeting Gen Z in Mumbai for World Environment Day
  ```
- [ ] Clicked "Generate Campaign" button
- [ ] Saw loading spinner
- [ ] Wait 1-2 minutes for generation
- [ ] Campaign canvas appeared with:
  - [ ] Strategy section (core concept, tagline)
  - [ ] Multiple asset cards (captions, images)
  - [ ] Posting calendar
  - [ ] Influencer recommendations
- [ ] All images loaded successfully
- [ ] All text content generated

## ✅ Test Features

### View Campaign
- [ ] Can see all generated assets
- [ ] Images display correctly
- [ ] Text content is readable
- [ ] Strategy section shows complete info

### Edit Asset
- [ ] Clicked "Edit" on a text asset
- [ ] Modified content
- [ ] Clicked "Save"
- [ ] Content updated

### Regenerate Asset
- [ ] Clicked "Regenerate" on an asset
- [ ] (Optional) Added modification instructions
- [ ] Clicked "Regenerate" again
- [ ] New version generated
- [ ] Version number incremented

### Export Campaign
- [ ] Clicked "Export Campaign" button
- [ ] ZIP file downloaded
- [ ] Opened ZIP file
- [ ] Contains `campaign_manifest.json`
- [ ] Contains `assets/` folder with images and text files

## ✅ Troubleshooting Checks

If something doesn't work, verify:

### API Key Issues
- [ ] `.env` file is in root directory (not backend/)
- [ ] API keys have no quotes around them
- [ ] API keys have no extra spaces
- [ ] `.env` file is not named `.env.txt`

### Backend Won't Start
- [ ] Virtual environment is activated (see `(venv)` in terminal)
- [ ] All dependencies installed without errors
- [ ] Port 8000 is not already in use
- [ ] Python version is 3.10 or higher

### Frontend Won't Start
- [ ] Node modules installed (`node_modules/` folder exists)
- [ ] Port 5173 is not already in use
- [ ] No errors in `npm install` output

### Generation Fails
- [ ] Backend terminal shows no errors
- [ ] Frontend browser console shows no errors
- [ ] API keys are valid (not expired/revoked)
- [ ] Internet connection is working

### Images Don't Generate
- [ ] Hugging Face token is valid
- [ ] Waited 30+ seconds (model loading time)
- [ ] Backend terminal shows image generation attempt
- [ ] Check backend terminal for specific error

### "Model is loading" Error
- [ ] This is normal for first image generation
- [ ] System will auto-retry after 20 seconds
- [ ] Just wait, don't refresh page

## ✅ Performance Checks

- [ ] Campaign generates in under 3 minutes
- [ ] Images appear within 30-60 seconds
- [ ] No memory issues (check Task Manager)
- [ ] Browser doesn't freeze during generation

## ✅ Security Checks

- [ ] `.env` file is in `.gitignore`
- [ ] Never committed API keys to git
- [ ] API keys not visible in browser DevTools
- [ ] `.env` file has correct permissions (not world-readable)

## ✅ Optional: Advanced Setup

- [ ] Set up git repository (`git init`)
- [ ] Added `.gitignore` (already included)
- [ ] Created first commit
- [ ] Set up remote repository (GitHub/GitLab)
- [ ] Pushed code (without `.env` file)

## 🎉 Success Criteria

You're ready to use the system when:

✅ Backend runs without errors
✅ Frontend loads in browser
✅ Test campaign generates successfully
✅ All assets display correctly
✅ Export downloads ZIP file
✅ No console errors

## 📞 Common Issues & Solutions

### Issue: "GOOGLE_API_KEY not found"
**Solution**: 
1. Ensure `.env` file exists in root directory
2. Check file is named `.env` not `.env.txt`
3. Verify API key is on correct line
4. Restart backend server

### Issue: "Module not found" errors
**Solution**:
1. Ensure virtual environment is activated
2. Run `pip install -r requirements.txt` again
3. Check Python version is 3.10+

### Issue: Frontend shows "Failed to fetch"
**Solution**:
1. Ensure backend is running on port 8000
2. Check CORS is enabled in backend
3. Verify proxy settings in `vite.config.js`

### Issue: Images not generating
**Solution**:
1. Verify Hugging Face token is valid
2. Wait 30 seconds for model to load
3. Check backend terminal for errors
4. Try regenerating the asset

### Issue: Slow generation
**Solution**:
1. First generation is always slower (model loading)
2. Subsequent generations are faster
3. Free tier APIs have rate limits
4. Consider upgrading to paid tiers for speed

## 📝 Notes

- First campaign generation takes 2-3 minutes (model loading)
- Subsequent campaigns are faster (~90 seconds)
- Free tier limits: ~30-50 campaigns per day
- Keep both terminals open while using the app
- Press Ctrl+C in terminals to stop servers

---

**Last Updated**: October 2025
**Status**: Ready for use ✅
