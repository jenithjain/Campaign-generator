# 🚀 Quick Install - Workflow Builder

## Installation Steps

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

This installs:
- `reactflow@^11.10.4` - Workflow canvas
- `zustand@^4.4.7` - State management  
- `react-router-dom@^6.21.0` - Routing (future use)

### 2. Start the Application

```bash
npm run dev
```

Access at: **http://localhost:5173**

### 3. Switch to Workflow Mode

1. Open the app
2. Click **"Workflow Builder"** button in the top right
3. Start building! 🎉

## What's New

### Files Added

```
frontend/src/
├── components/workflow/
│   ├── WorkflowBuilder.jsx     ← Main workflow canvas
│   ├── AgentNode.jsx           ← Custom node component
│   ├── Sidebar.jsx             ← Draggable agent blocks
│   └── WorkflowNavbar.jsx      ← Top control bar
├── store/
│   └── workflowStore.js        ← Zustand state
├── api/
│   └── agentAPI.js             ← Agent API (mock + real)
└── workflow.css                ← Custom styles
```

### Files Modified

- `package.json` - Added dependencies
- `App.jsx` - Added mode toggle
- `main.jsx` - Imported workflow CSS
- `index.html` - Updated title

## Quick Test

1. **Drag** a "Strategy Agent" from the sidebar
2. **Drop** it on the canvas
3. **Drag** a "Copywriting Agent"
4. **Connect** them (drag from right handle to left handle)
5. **Click** "Run Agent" on Strategy node
6. Watch it execute! ✨
7. **Click** "Run Workflow" to run all connected nodes

## Features Ready to Use

✅ Drag & drop agents  
✅ Connect agents with edges  
✅ Run individual agents  
✅ Run entire workflow  
✅ Save/load to localStorage  
✅ Export as JSON  
✅ Zoom & pan controls  
✅ Real-time status updates  

## Currently Using Mock Data

The agents return **mock responses** for now (defined in `agentAPI.js`).

To connect to your **real backend**:
1. Implement agent endpoints in FastAPI
2. Update `agentAPI.js` to use real endpoints
3. Uncomment the real API calls

See `WORKFLOW_BUILDER_GUIDE.md` for detailed backend integration.

## Troubleshooting

**If npm install fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**If you see errors about React Flow:**
```bash
npm install reactflow@11.10.4 --force
```

**To clear saved workflows:**
Open browser console and run:
```javascript
localStorage.removeItem('brandmind_workflow');
```

## Next Steps

1. ✅ Install and test the workflow builder
2. 📖 Read the full guide: `WORKFLOW_BUILDER_GUIDE.md`
3. 🔧 Customize agent types and styles
4. 🔌 Connect to your backend API
5. 🚀 Build amazing workflows!

---

**Need help?** Check `WORKFLOW_BUILDER_GUIDE.md` for comprehensive documentation.

