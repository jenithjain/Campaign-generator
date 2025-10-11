# 🚀 Quick Start Guide

## ⚡ 1-Click Start (Windows)

Just double-click:
```
start-integrated-app.bat
```

This will:
1. Check Python & Node.js
2. Install dependencies (if needed)
3. Start backend (port 8000)
4. Start frontend (port 5173)
5. Open browser automatically!

---

## 📋 Manual Start

### **Terminal 1 - Backend:**
```bash
cd Campaign-generator/backend
python main.py
```

### **Terminal 2 - Frontend:**
```bash
cd Campaign-generator/frontend
npm run dev
```

### **Browser:**
```
http://localhost:5173/
```

---

## 🌐 Available Pages

| URL | Description |
|-----|-------------|
| `http://localhost:5173/` | 🏠 Landing page (hero + features) |
| `http://localhost:5173/about` | ℹ️ About page |
| `http://localhost:5173/login` | 🔐 User login |
| `http://localhost:5173/signup` | ✍️ User registration |
| `http://localhost:5173/campaign` | 🎯 Campaign generator + workflow builder |

---

## 🧪 Quick Test

### **Test Authentication:**
1. Go to `http://localhost:5173/signup`
2. Create account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123
3. Login with those credentials
4. You'll be redirected to `/campaign` ✓

### **Test Campaign Generator:**
1. On `/campaign` page
2. Try **Quick Mode**:
   - Enter: "Launch eco-friendly water bottles"
   - Click Generate
3. Try **Workflow Builder**:
   - Drag "Visual Design Agent" to canvas
   - Enter: "modern tech office"
   - Click "Run"
   - Wait 30-60 seconds
   - See 3 AI-generated images! ✓

---

## 🎯 Features Available

### **Landing Page (`/`):**
- ✨ 3D animated background (Spline)
- 🎨 Hero section with stats
- 📊 Features grid
- 🔗 Navigation to all pages

### **Authentication:**
- 📝 User registration
- 🔐 Secure login
- 🔒 Password hashing (SHA-256)
- 💾 Token-based auth

### **Campaign Generator (`/campaign`):**
- ⚡ Quick Mode (simple brief input)
- 🔄 Workflow Builder (drag & drop agents)
- 🤖 5 AI Agents:
  - Strategy (Gemini AI)
  - Copywriting (Gemini AI)
  - Visual Design (Stable Diffusion)
  - Market Research (Tavily Search)
  - Media Planning (Gemini AI)
- 🖼️ Real AI image generation
- 📤 Export workflows (PNG/PDF/JSON)
- 📥 Import workflows (drag & drop)

---

## 🔑 Required API Keys

**Create `.env` file:**
```env
GOOGLE_API_KEY=your_gemini_key_here
HUGGINGFACE_API_TOKEN=hf_your_token_here
TAVILY_API_KEY=tvly-your_key_here
```

**Get Keys:**
- Google (Gemini): https://ai.google.dev/
- Hugging Face: https://huggingface.co/settings/tokens
- Tavily: https://tavily.com/

---

## 📱 Responsive Design

Works on:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

---

## 🎨 UI Theme

**Colors:**
- Primary: `rgb(173, 248, 45)` - Neon green
- Background: Dark gradient
- Text: White/Light gray
- Accents: Blue, Purple

**Fonts:**
- System default (fast loading)
- Bold for headings
- Regular for body

---

## 🐛 Troubleshooting

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.8+

# Install dependencies
cd backend
pip install -r requirements.txt
```

**Frontend won't start:**
```bash
# Check Node version
node --version  # Should be 16+

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**3D background not loading:**
```
Issue: Spline scene stuck on "Loading..."
Fix: Check internet connection (Spline loads from CDN)
Alternative: Comment out <BackgroundSpline /> in App.jsx
```

**Auth not working:**
```
Issue: Login fails with network error
Fix: Make sure backend is running on port 8000
Check: http://localhost:8000/ should show API status
```

---

## 📊 Backend Endpoints

### **Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login

### **Campaign Generator:**
- `POST /api/generate-campaign` - Generate full campaign
- `GET /api/campaign/{id}` - Get campaign by ID
- `POST /api/regenerate-asset` - Regenerate specific asset

### **Workflow Agents:**
- `POST /api/agents/strategy` - Strategy planning
- `POST /api/agents/copywriting` - Content creation
- `POST /api/agents/visual` - Image generation
- `POST /api/agents/research` - Web research
- `POST /api/agents/media` - Media planning

---

## 🔄 Development Workflow

### **Frontend Changes:**
```bash
cd frontend
npm run dev
# Edit files in src/
# Changes auto-reload (Hot Module Replacement)
```

### **Backend Changes:**
```bash
cd backend
# Edit files in backend/
# Restart: Ctrl+C, then python main.py
```

### **Build for Production:**
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## 🎓 Learning Resources

**For React:**
- React Docs: https://react.dev/
- React Router: https://reactrouter.com/

**For FastAPI:**
- FastAPI Docs: https://fastapi.tiangolo.com/
- Pydantic: https://docs.pydantic.dev/

**For Spline:**
- Spline: https://spline.design/
- React Spline: https://www.npmjs.com/package/@splinetool/react-spline

---

## 💡 Tips

1. **Keep both terminals open** while using the app
2. **Clear browser cache** if you see old content
3. **Check console logs** (F12) for errors
4. **Use incognito mode** to test auth flow
5. **Save API keys** in a secure password manager

---

## ✨ Next Features to Build

- [ ] User profile page
- [ ] Campaign history
- [ ] Team collaboration
- [ ] Campaign templates
- [ ] A/B testing
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Email notifications

---

## 📞 Support

**If you encounter issues:**

1. Check `INTEGRATION_COMPLETE.md` for detailed docs
2. Look at browser console (F12) for errors
3. Check backend terminal for error messages
4. Verify all API keys are set in `.env`

---

**Ready to go!** 🎉

Just run `start-integrated-app.bat` or follow the manual steps above!

