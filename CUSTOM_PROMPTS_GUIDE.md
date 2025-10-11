# 🎯 Custom Prompts Guide

## ✨ The System Now Uses YOUR Prompts!

The workflow builder now **dynamically generates content** based on the text you enter in each node!

---

## 🚀 How to Use Custom Prompts

### Step 1: Enter Your Prompt in the Node

Click on any node and type your custom instructions in the text area:

```
┌─────────────────────────────────────┐
│  🎯 Strategy Agent         [✓] [🗑] │
│  ─────────────────────────────────  │
│  ┌─────────────────────────────────┤
│  │ Launch a luxury tech smartwatch │  ← YOUR CUSTOM PROMPT!
│  │ for fitness enthusiasts         │
│  └─────────────────────────────────┘
│  [▶ Run Agent]                      │
└─────────────────────────────────────┘
```

### Step 2: Run the Agent

Click **"Run Agent"** or **"Start Workflow"** and watch it generate content based on YOUR input!

---

## 📝 Example Custom Prompts

### Example 1: Tech Product Launch

**Your Input:**
```
Launch a luxury AI-powered smartwatch for fitness enthusiasts on LinkedIn and Instagram
```

**What You Get:**
- **Strategy**: "Strategic positioning for luxury AI-powered smartwatch..."
- **Tagline**: "AI-powered That Works" or "Experience AI-powered Differently"
- **Tone**: "Innovative, cutting-edge, forward-thinking"
- **Channels**: Instagram, LinkedIn (detected from your input!)
- **Colors**: Futuristic blue theme (#0066FF, #00D9FF)

### Example 2: Eco-Friendly Fashion

**Your Input:**
```
Sustainable fashion brand for Gen Z targeting TikTok and Instagram with eco-friendly materials
```

**What You Get:**
- **Strategy**: "Strategic positioning for sustainable fashion brand..."
- **Tagline**: "Sustainable Redefined" or "Fashion That Works"
- **Tone**: "Authentic, purpose-driven, conscious"
- **Channels**: TikTok, Instagram (detected!)
- **Colors**: Earthy green theme (#2D5016, #8DB600)
- **Emojis**: 🌱 (eco-related)

### Example 3: B2B Software

**Your Input:**
```
Professional B2B project management software for enterprise teams on LinkedIn
```

**What You Get:**
- **Strategy**: "Strategic positioning for professional B2B project management..."
- **Tone**: "Professional, engaging, trustworthy"
- **Channels**: LinkedIn (detected!)
- **Colors**: Professional blue theme (#5B9DFE)
- **Copy**: Business-focused captions

---

## 🎨 Smart Detection Features

The system **intelligently detects** keywords and adapts the output:

### 1️⃣ Platform Detection
**Your Input Contains** → **Auto-detects**
- "Instagram" or "visual" → Instagram
- "TikTok" or "video" → TikTok
- "LinkedIn" or "B2B" → LinkedIn
- "Facebook" → Facebook
- "Twitter" → Twitter

### 2️⃣ Tone Detection
**Your Input Contains** → **Tone**
- "eco", "green", "sustainable" → Authentic, purpose-driven
- "tech", "AI", "digital" → Innovative, cutting-edge
- "luxury", "premium" → Sophisticated, elegant
- "fun", "young", "Gen Z" → Energetic, playful

### 3️⃣ Visual Theme Detection
**Your Input Contains** → **Color Palette**
- "eco", "nature" → Earthy greens 🌿
- "tech", "AI" → Futuristic blues 🚀
- "luxury" → Black & gold 💎
- "fun", "colorful" → Vibrant colors 🎨

### 4️⃣ Keyword Extraction
The system extracts important keywords and uses them in:
- Captions and copy
- Hashtags (#YourKeyword)
- Competitor analysis
- Influencer suggestions

---

## 🔄 Chained Workflow Example

### Complete Example: Tech Startup Campaign

**Node 1: Strategy Agent**
```
Input: "Launch an AI productivity app for remote workers on LinkedIn and Twitter"
```
**Output:**
- Core concept: Strategic positioning for AI productivity app
- Channels: LinkedIn, Twitter
- Tone: Innovative, forward-thinking
- Tagline: "AI Productivity Redefined"

**Node 2: Copywriting Agent** (connected to Strategy)
```
Input: (Receives Strategy output automatically)
```
**Output:**
- "✨ AI Productivity that makes a difference. #AIProductivity"
- "🚀 Transform your experience with AI Productivity. Join the movement!"
- CTA: "Get Your AI Productivity Now"

**Node 3: Visual Design Agent** (connected to Strategy)
```
Input: (Receives Strategy output automatically)
```
**Output:**
- Colors: #0066FF, #00D9FF, #1E1E2E
- Style: "Futuristic, clean, tech-forward with blue accents"
- Concepts: Modern tech aesthetic

**Node 4: Media Planner** (connected to all above)
```
Input: (Receives all outputs)
```
**Output:**
- Schedule with LinkedIn and Twitter posts
- Budget allocation for each platform
- Launch timeline

---

## 💡 Pro Tips

### 1. Be Specific
✅ Good: "Eco-friendly coffee brand for Gen Z on Instagram"
❌ Vague: "coffee"

### 2. Mention Platforms
Include platform names if you want specific targeting:
- "on Instagram and TikTok"
- "LinkedIn campaign"
- "Facebook ads"

### 3. Include Keywords
Important words you mention will appear in:
- Generated copy
- Hashtags
- Research results

### 4. Set the Tone
Use descriptive words:
- "luxury", "premium" → upscale content
- "fun", "playful" → casual content
- "professional", "B2B" → business content
- "eco", "sustainable" → conscious content

### 5. Chain Nodes Effectively
```
Strategy → Copywriting → Media Plan
    ↓
  Visual Design
```
This way, all downstream nodes receive the strategy context!

---

## 🎯 Try These Examples

### Example 1: Fashion Brand
```
Node 1 (Strategy): 
"Luxury sustainable fashion brand for millennials on Instagram"

Node 2 (Copywriting - connected):
(Leave empty to use Strategy output)

Node 3 (Visual - connected):
(Leave empty to use Strategy output)
```

### Example 2: Tech Product
```
Node 1 (Strategy):
"AI-powered fitness tracker for tech-savvy Gen Z on TikTok and Instagram"

Node 2 (Research - connected):
"Find fitness tech competitors and influencers"

Node 3 (Copywriting - connected):
(Receives both Strategy + Research)
```

### Example 3: B2B Service
```
Node 1 (Strategy):
"Enterprise project management software for remote teams on LinkedIn"

Node 2 (Copywriting - connected):
"Focus on productivity and collaboration features"

Node 3 (Media - connected):
(Creates LinkedIn-focused campaign schedule)
```

---

## 🔧 Advanced Usage

### Combining Multiple Inputs

When nodes are connected, they receive **combined input**:

```
Node A output: "Eco-friendly product for Gen Z"
       ↓
Node B input: "Focus on Instagram stories"
       ↓
Node B receives: 
"Eco-friendly product for Gen Z
---
Focus on Instagram stories"
```

This allows downstream nodes to build upon previous context!

---

## 📊 What Gets Customized

Based on YOUR input, these elements adapt:

✅ **Strategy Agent:**
- Core concept (includes your keywords)
- Tagline (generated from your input)
- Target audience (based on context)
- Tone (detected from keywords)
- Channels (detected or defaulted)

✅ **Copywriting Agent:**
- Captions (uses your keywords)
- Hashtags (generated from keywords)
- CTA buttons (customized)
- Emojis (matched to theme)

✅ **Visual Design Agent:**
- Color palettes (theme-based)
- Style descriptions (adapted)
- Image concepts (context-aware)

✅ **Research Agent:**
- Competitor research (based on keywords)
- Influencer suggestions (keyword-based handles)
- Trend analysis (customized)

✅ **Media Planner:**
- Platform selection (from your input)
- Content calendar (customized dates)
- Budget allocation (platform-specific)

---

## 🎉 Summary

Your workflow builder now:

✨ **Reads your custom prompts** from the text area  
✨ **Detects keywords automatically** (platforms, tone, themes)  
✨ **Generates personalized content** based on your input  
✨ **Passes data between nodes** in chained workflows  
✨ **Adapts output format** to match your context  

**No more hardcoded coffee brand examples!** 🎉

Every run uses YOUR specific campaign brief and instructions.

---

## 🚀 Get Started

1. Open Workflow Builder
2. Drag a Strategy Agent
3. Type: "YOUR campaign idea here"
4. Click "Run Agent"
5. See customized results! ✨

**Try it with different keywords and watch the magic happen!** 🪄

