# 🎯 BrandMind AI - Integrated Campaign Platform

> **An AI-powered platform for autonomous brand campaigns with a beautiful 3D UI**

![Version](https://img.shields.io/badge/version-2.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![React](https://img.shields.io/badge/react-18-blue)
![FastAPI](https://img.shields.io/badge/fastapi-latest-teal)

---

## ✨ Features

### 🎨 **Beautiful Landing Page**
- 3D animated background (Spline)
- Hero section with compelling CTAs
- Features showcase
- Fully responsive design

### 🔐 **User Authentication**
- Secure registration & login
- Token-based auth
- Password hashing (SHA-256)
- User profile management

### 🤖 **AI Campaign Generator**
- **Quick Mode**: Simple brief → Full campaign
- **Workflow Builder**: Drag & drop AI agents
- **5 AI Agents**:
  - 📊 Strategy Planning (Gemini AI)
  - ✍️ Copywriting (Gemini AI)
  - 🎨 Visual Design (Stable Diffusion)
  - 🔍 Market Research (Tavily Search)
  - 📅 Media Planning (Gemini AI)

### 🖼️ **Real AI Image Generation**
- Generate 3 image variations
- Click to select favorite
- Regenerate with new prompts
- High-quality outputs

### 🔄 **Workflow Management**
- Save workflows to localStorage
- Export as PNG/PDF/JSON
- Import workflows (drag & drop)
- Chained agent execution

---

## 🚀 Quick Start

### **1-Click Start (Windows):**
```bash
# Double-click this file:
start-integrated-app.bat
```

### **Manual Start:**

**Terminal 1 - Backend:**
```bash
cd Campaign-generator/backend
python main.py
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd Campaign-generator/frontend
npm run dev
# Runs on http://localhost:5173
```

**Browser:**
```
http://localhost:5173/
```

---

## 📋 Prerequisites

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **API Keys:**
  - Google AI (Gemini): https://ai.google.dev/
  - Hugging Face: https://huggingface.co/settings/tokens
  - Tavily Search: https://tavily.com/

---

## 🔧 Installation

### **1. Clone Repository:**
```bash
git clone <your-repo>
cd Campaign-generator
```

### **2. Setup Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### **3. Setup Frontend:**
```bash
cd frontend
npm install
```

### **4. Configure API Keys:**

Create `.env` file in `Campaign-generator/` directory:

```env
GOOGLE_API_KEY=AIza...your_gemini_key
HUGGINGFACE_API_TOKEN=hf_...your_token
TAVILY_API_KEY=tvly-...your_key
```

---

## 🌐 Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Landing page with hero + features |
| `/about` | About | About information |
| `/login` | Login | User authentication |
| `/signup` | Signup | User registration |
| `/campaign` | Campaign | Generator + Workflow Builder |

---

## 🏗️ Architecture

```
Campaign-generator/
├── backend/                 # FastAPI backend
│   ├── main.py             # API server
│   ├── agents/             # AI agent implementations
│   ├── tools/              # LLM, Image, Search tools
│   ├── models/             # Pydantic schemas
│   └── storage/            # File storage
│       ├── campaigns/      # Campaign data
│       ├── assets/         # Generated images
│       └── users/          # User accounts
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── CampaignPage.jsx
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── BackgroundSpline.jsx
│   │   │   └── workflow/  # Workflow builder
│   │   └── App.jsx        # Main app with routing
│   └── package.json
│
├── .env                   # API keys (create this!)
├── env.template           # Template for .env
└── start-integrated-app.bat  # 1-click starter
```

---

## 🎨 Tech Stack

### **Frontend:**
- **React 18** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **React Flow** - Workflow builder
- **Zustand** - State management
- **Spline** - 3D backgrounds
- **Lucide React** - Icons
- **Axios** - HTTP client

### **Backend:**
- **FastAPI** - Web framework
- **Python 3.8+** - Language
- **Pydantic** - Data validation
- **Google Gemini** - LLM
- **Stable Diffusion** - Image generation
- **Tavily** - Web search

---

## 📊 API Endpoints

### **Authentication:**
```
POST /api/auth/register     # Create account
POST /api/auth/login        # User login
```

### **Campaign Generator:**
```
POST /api/generate-campaign # Generate full campaign
GET  /api/campaign/{id}     # Get campaign by ID
POST /api/regenerate-asset  # Regenerate specific asset
```

### **Workflow Agents:**
```
POST /api/agents/strategy      # Strategy planning
POST /api/agents/copywriting   # Content creation
POST /api/agents/visual        # Image generation
POST /api/agents/research      # Market research
POST /api/agents/media         # Media planning
```

---

## 🎯 Usage Examples

### **Example 1: Quick Mode**
```
1. Go to /campaign
2. Enter brief: "Launch eco-friendly water bottles"
3. Click "Generate Campaign"
4. Get full campaign manifest with assets
```

### **Example 2: Workflow Builder**
```
1. Go to /campaign
2. Click "Workflow Builder"
3. Drag agents to canvas:
   Strategy → Copywriting → Visual Design
4. Connect with edges
5. Click "Start Workflow"
6. All agents execute in sequence
```

### **Example 3: Image Generation**
```
1. Add "Visual Design Agent" to workflow
2. Enter prompt: "modern tech office"
3. Click "Run"
4. Wait 30-60 seconds
5. Get 3 AI-generated images
6. Click to select, regenerate for new options
```

---

## 🎨 Customization

### **Change Theme Colors:**

**`frontend/src/components/Navbar.jsx`:**
```javascript
// Change primary color
style={{ backgroundColor: 'rgb(173, 248, 45)' }}
// To your color:
style={{ backgroundColor: 'rgb(255, 0, 128)' }}
```

### **Change 3D Background:**

**`frontend/src/components/BackgroundSpline.jsx`:**
```javascript
scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode"
```

Create your own at [spline.design](https://spline.design/)

### **Add New Agent:**

1. **Backend:** Add endpoint in `backend/main.py`
```python
@app.post("/api/agents/mynewagent")
async def run_new_agent(request: dict):
    # Your logic here
    return {"success": True, "output": result}
```

2. **Frontend:** Add to sidebar in `frontend/src/components/workflow/Sidebar.jsx`
```javascript
{ 
  type: 'mynewagent', 
  label: 'My New Agent', 
  icon: '🆕',
  color: '#yourcolor' 
}
```

---

## 🐛 Troubleshooting

### **Issue: Backend won't start**
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### **Issue: Frontend errors**
```bash
# Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **Issue: Images not generating**
```
1. Check backend terminal for errors
2. Verify HUGGINGFACE_API_TOKEN in .env
3. Wait 30-60 seconds (first generation is slow)
4. Check backend/storage/assets/ for saved images
```

### **Issue: 3D background not loading**
```
- Check internet connection (loads from CDN)
- Try hard refresh (Ctrl+Shift+R)
- If still issues, comment out <BackgroundSpline /> in App.jsx
```

---

## 📚 Documentation

- **`QUICK_START.md`** - Get started in 5 minutes
- **`INTEGRATION_COMPLETE.md`** - Full technical details
- **`API_REFERENCE.md`** - Complete API docs
- **`ARCHITECTURE.md`** - System architecture

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🙏 Acknowledgments

- **Google Gemini** - LLM API
- **Hugging Face** - Image generation
- **Tavily** - Web search
- **Spline** - 3D backgrounds
- **React Flow** - Workflow builder
- **FastAPI** - Backend framework

---

## 📞 Support

Having issues? Check out:

1. **Troubleshooting section** above
2. **`INTEGRATION_COMPLETE.md`** for detailed setup
3. **Browser console (F12)** for frontend errors
4. **Backend terminal** for API errors

---

## 🎉 What's New in v2.0

- ✨ Beautiful landing page with 3D animations
- 🔐 User authentication system
- 🎨 Consistent UI across all pages
- 🌐 Complete routing with React Router
- 📱 Fully responsive design
- 🖼️ Real AI image generation
- 📤 Export/import workflows
- 🔄 Chained workflow execution
- 📊 Markdown-formatted output
- 🎯 5 specialized AI agents

---

## 🚀 Roadmap

### **Phase 1: Foundation** ✅
- [x] Landing page
- [x] User authentication
- [x] Campaign generator
- [x] Workflow builder
- [x] AI image generation

### **Phase 2: Enhanced Features** 🔄
- [ ] User profile management
- [ ] Campaign history
- [ ] Team collaboration
- [ ] Campaign templates
- [ ] Analytics dashboard

### **Phase 3: Advanced** 📋
- [ ] Mobile app
- [ ] Email notifications
- [ ] A/B testing
- [ ] Multi-language support
- [ ] API rate limiting

---

**Built with ❤️ using AI**

Get started now: `start-integrated-app.bat` or follow [QUICK_START.md](QUICK_START.md)!

