# 🚀 BrandMind AI - Workflow Builder Guide

## Overview

The **Workflow Builder** is a visual, node-based interface for creating autonomous AI campaign workflows. Similar to n8n or Flowise, it allows you to drag, drop, and connect different AI agents to build custom campaign generation pipelines.

## Features

### ✨ Core Features
- **Visual Workflow Editor** - Drag and drop interface powered by React Flow
- **5 Specialized AI Agents**:
  - 🎯 **Strategy Agent** - Campaign strategy and positioning
  - ✍️ **Copywriting Agent** - Marketing copy and captions
  - 🎨 **Visual Design Agent** - Image concepts and design
  - 🔍 **Market Research Agent** - Trends and competitor analysis
  - 📊 **Media Planner Agent** - Scheduling and budget allocation

- **Node Connections** - Connect agents to pass data between them
- **Individual Execution** - Run each agent independently
- **Workflow Execution** - Run entire connected workflow in sequence
- **State Persistence** - Save/load workflows to localStorage
- **Export Functionality** - Download workflow as JSON
- **Real-time Status** - Visual feedback for running/success/error states

### 🎨 UI/UX
- Dark mode canvas (slate-900 background)
- Color-coded nodes by agent type
- Smooth animations and transitions
- Zoom and pan controls
- Mini-map for navigation
- Professional, futuristic design

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install the new packages:
- `reactflow` - Node-based workflow canvas
- `zustand` - Lightweight state management
- `react-router-dom` - (Optional for future routing)

### 2. Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Usage

### Switching Modes

The app has two modes accessible via toggle buttons in the header:

1. **Quick Mode** ⚡ - Original simple campaign generator
2. **Workflow Builder** 🔄 - New visual workflow interface

### Building a Workflow

#### Step 1: Add Agents
1. From the left sidebar, **drag an agent block**
2. **Drop it onto the canvas**
3. The agent node appears with a title, run button, and I/O handles

#### Step 2: Connect Agents
1. Click and drag from a **source handle** (right side of node)
2. Connect to a **target handle** (left side of another node)
3. Blue animated lines show the connection

#### Step 3: Configure Agents
1. Click on a node to edit
2. Enter instructions in the text area
3. Each agent can have custom input

#### Step 4: Run Workflow

**Option A: Run Individual Agent**
- Click the "Run Agent" button on any node
- That agent executes with its input
- Output appears below the button

**Option B: Run Entire Workflow**
- Click "Run Workflow" in the top navbar
- Agents execute in topological order (based on connections)
- Each agent receives output from connected upstream agents

### Example Workflow

```
User Brief Input
      ↓
Strategy Agent → Copywriting Agent → Media Planner Agent
      ↓
Visual Design Agent
```

**Flow:**
1. Strategy Agent defines the campaign concept
2. Output goes to both Copywriting and Visual agents
3. Copywriting creates captions
4. Visual creates image concepts
5. Media Planner schedules posts

### Saving & Loading

**Save Workflow**
- Click "Save" button in navbar
- Workflow saved to browser's localStorage
- Persists across sessions

**Load Workflow**
- Click "Load" button
- Restores previously saved workflow

**Export Workflow**
- Click "Export" button
- Downloads workflow as JSON file
- Can be shared or version controlled

**Clear Workflow**
- Click "Clear" button
- Removes all nodes (with confirmation)

## Architecture

### Frontend Components

```
src/
├── components/
│   └── workflow/
│       ├── WorkflowBuilder.jsx    # Main canvas component
│       ├── AgentNode.jsx          # Custom node component
│       ├── Sidebar.jsx            # Agent blocks sidebar
│       └── WorkflowNavbar.jsx     # Top controls bar
├── store/
│   └── workflowStore.js           # Zustand state management
├── api/
│   └── agentAPI.js                # Agent execution API
└── workflow.css                   # Custom React Flow styles
```

### State Management (Zustand)

The workflow store manages:
- **Nodes** - Array of agent nodes with position and data
- **Edges** - Array of connections between nodes
- **Workflow name** - Editable workflow title
- **Actions** - Add, update, remove, save, load

### API Integration

#### Current (Mock Mode)
Uses `mockAgentResponses` in `agentAPI.js` for development.

#### Future (Real Backend)
Uncomment the real API calls in `agentAPI.js`:

```javascript
// Real API endpoint
const response = await axios.post(`${API_BASE_URL}/api/agent/run`, {
  agent_type: agentType,
  input: input,
});
```

## Backend Integration

### Creating Agent Endpoints

Add these endpoints to your FastAPI backend:

```python
# backend/main.py

@app.post("/api/agent/run")
async def run_agent(request: AgentRequest):
    """Run a specific agent"""
    agent_type = request.agent_type
    input_data = request.input
    
    if agent_type == "strategy":
        result = await strategy_agent.run(input_data)
    elif agent_type == "copywriting":
        result = await copywriting_agent.run(input_data)
    # ... etc
    
    return {"success": True, "result": result}

@app.post("/api/workflow/run")
async def run_workflow(workflow: WorkflowRequest):
    """Execute entire workflow"""
    # Implement workflow orchestration
    pass
```

### Agent Implementation Example

```python
# backend/agents/strategy_agent.py

class StrategyAgent:
    def __init__(self):
        self.llm = get_llm_client()
    
    async def run(self, input_data: str):
        prompt = f"Create a campaign strategy for: {input_data}"
        response = await self.llm.generate(prompt)
        
        return {
            "core_concept": response.core_concept,
            "tagline": response.tagline,
            "target_audience": response.target_audience,
            # ...
        }
```

## Customization

### Adding New Agent Types

1. **Update `agentTypes` in Sidebar.jsx**:
```javascript
{
  type: 'email',
  label: 'Email Agent',
  icon: Mail,
  color: 'cyan',
  description: 'Creates email campaigns',
}
```

2. **Add color class in Sidebar.jsx**:
```javascript
cyan: 'border-cyan-400 bg-cyan-50 hover:bg-cyan-100 text-cyan-700',
```

3. **Add style in AgentNode.jsx**:
```javascript
email: {
  border: 'border-cyan-400',
  bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
  icon: '📧',
  glow: 'shadow-cyan-400/50',
},
```

4. **Implement API function in agentAPI.js**:
```javascript
email: async (input) => {
  // API call or mock response
}
```

### Customizing Styles

Edit `workflow.css` to change:
- Canvas background color
- Node borders and shadows
- Connection line styles
- Control button colors

## Troubleshooting

### Nodes Not Appearing
- Check browser console for errors
- Ensure React Flow is installed: `npm list reactflow`
- Clear localStorage: `localStorage.clear()`

### Connections Not Working
- Make sure nodes have proper handles (source/target)
- Check that `onConnect` is properly bound

### API Errors
- Currently using mock responses - should work offline
- Check `agentAPI.js` for mock response structure
- Enable CORS on backend when connecting real API

### State Not Persisting
- Check localStorage quota (max ~5-10 MB)
- Clear old data: `localStorage.removeItem('brandmind_workflow')`

## Keyboard Shortcuts

- **Backspace/Delete** - Delete selected node
- **Cmd/Ctrl + S** - Save workflow (if implemented)
- **Mouse wheel** - Zoom in/out
- **Click + Drag canvas** - Pan view

## Brand Colors Reference

```css
Primary: #5B9DFE (Electric Blue)
Background: #1E1E2E (Dark Slate)
Text: #E2E8F0 (Light Gray)
Success: #4ADE80 (Green)
Error: #EF4444 (Red)
Warning: #F59E0B (Orange)
```

## Next Steps

### Phase 1: Polish (Current)
- ✅ Visual workflow builder
- ✅ Agent nodes with I/O
- ✅ Connection system
- ✅ Save/load functionality
- ✅ Mock API responses

### Phase 2: Backend Integration
- [ ] Connect to real FastAPI endpoints
- [ ] Implement agent execution logic
- [ ] Add authentication
- [ ] Store workflows in database

### Phase 3: Advanced Features
- [ ] Conditional branching (if/else nodes)
- [ ] Loop nodes (iterate over lists)
- [ ] Variable nodes (store/retrieve data)
- [ ] Webhook triggers
- [ ] Scheduled execution
- [ ] Collaboration features

### Phase 4: Production
- [ ] User authentication
- [ ] Workflow templates library
- [ ] Analytics dashboard
- [ ] Team workspaces
- [ ] API rate limiting
- [ ] Error handling & retry logic

## Support

For issues or questions:
1. Check the console for error messages
2. Review this guide
3. Check React Flow documentation: https://reactflow.dev
4. Inspect the mock responses in `agentAPI.js`

---

**Built with ❤️ using React Flow, Zustand, and Tailwind CSS**

