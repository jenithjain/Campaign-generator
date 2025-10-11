# 🎨 Workflow Export & Import Guide

## ✨ New Features Added

### 1. **Clean Export (No Controls/Minimap)** ✅
When you export your workflow as PNG or PDF, the controls (zoom buttons) and minimap are automatically hidden for a clean, professional image.

**What's Hidden:**
- ➖ Zoom controls (+ - buttons)
- 🗺️ Minimap
- 📝 React Flow attribution

**Result:** Clean, presentation-ready workflow images!

---

### 2. **Drag & Drop Import** 🎯
You can now import workflow JSON files by simply dragging and dropping them onto the canvas!

#### **How to Use:**

**Method 1: Drag & Drop** (Easiest!)
1. Export a workflow as JSON first (Export → Export as JSON)
2. Simply drag the JSON file from your file explorer
3. Drop it anywhere on the workflow canvas
4. A blue overlay will appear to confirm drop zone
5. ✅ Workflow loads automatically!

**Method 2: Import Button** (Manual)
1. Click the "Import" button in the top navbar
2. Select your workflow JSON file
3. ✅ Workflow loads instantly!

**Safety Features:**
- If you already have a workflow open, you'll be asked to confirm before replacing it
- Only valid JSON files are accepted
- Invalid files show helpful error messages

---

## 🚀 Complete Workflow Process

### Export a Workflow:
```
1. Build your workflow (add nodes, connect them)
2. Click "Export" button (top navbar)
3. Choose format:
   - 🖼️ PNG → High-quality image (clean, no controls)
   - 📄 PDF → Printable document (clean, no controls)  
   - 💾 JSON → Workflow data (for importing later)
```

### Import a Workflow:
```
Option A: Drag & Drop
1. Drag JSON file from your computer
2. Drop onto canvas
3. Done! ✅

Option B: Import Button
1. Click "Import" button
2. Select JSON file
3. Done! ✅
```

---

## 💡 Use Cases

### Team Collaboration
```
1. Create workflow → Export as JSON
2. Share JSON with team via email/Slack
3. Team drags file onto their canvas
4. Everyone has the same workflow!
```

### Version Control
```
1. Save different workflow versions as JSON files
2. Name them: "campaign-v1.json", "campaign-v2.json"
3. Switch between versions by drag & drop
```

### Presentations
```
1. Build workflow
2. Export as PNG/PDF (automatically clean!)
3. Add to PowerPoint/Google Slides
4. No manual editing needed!
```

---

## 🎨 Visual Feedback

### **During Export:**
- Controls & minimap temporarily hidden
- 100ms wait for smooth rendering
- Auto-restored after capture

### **During Import (Drag & Drop):**
- Blue overlay appears when dragging file over canvas
- Upload icon (📤) shows drop zone
- Text confirms: "Drop Workflow JSON Here"
- Disappears when drop completes

### **Empty Canvas:**
Shows helpful message:
```
Start Building Your Workflow
Drag agents from the sidebar and drop them here

Or drag & drop a workflow JSON file to import
```

---

## 🔧 Technical Details

### Export Clean Images:
```javascript
// Automatically hides:
- .react-flow__controls
- .react-flow__minimap  
- .react-flow__attribution

// Settings:
- Background: #1e293b (slate dark)
- Scale: 2x (high quality)
- Format: PNG or PDF
```

### Import Validation:
```javascript
// Checks:
✓ File is JSON
✓ Has "nodes" array
✓ Has "edges" array
✓ Valid workflow structure

// Optional:
✓ Workflow name (restored if present)
```

---

## 📋 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save Workflow | Click "Save" |
| Import JSON | Click "Import" or Drag & Drop |
| Export PNG | Export → PNG |
| Export PDF | Export → PDF |
| Export JSON | Export → JSON |

---

## 🐛 Troubleshooting

### Export shows controls/minimap?
- **Cause:** Old browser cache
- **Fix:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Drag & drop not working?
- **Cause:** Dragging from wrong location
- **Fix:** Ensure you're dragging from file explorer, not from browser
- **Tip:** Use "Import" button instead

### Invalid workflow file?
- **Cause:** JSON structure doesn't match expected format
- **Fix:** Only import JSON files exported from BrandMind AI

### Import replaces my workflow?
- **Expected:** You'll be asked to confirm first
- **Safety:** Always export current workflow before importing new one

---

## 📸 Before & After

### Before (Old Export):
```
✅ Workflow
❌ Zoom controls visible
❌ Minimap visible
❌ Attribution text
```

### After (New Export):
```
✅ Workflow
✅ Clean canvas
✅ Professional look
✅ Presentation ready
```

---

## 🎯 Quick Test

**Test Export:**
```bash
1. Add 2-3 nodes to canvas
2. Connect them
3. Click "Export" → "Export as PNG"
4. Check downloaded file
5. ✓ Should be clean (no controls/minimap)
```

**Test Import:**
```bash
1. Export workflow as JSON
2. Clear canvas (or open new tab)
3. Drag JSON file onto canvas
4. ✓ Workflow should load
```

---

## 🎉 Summary

**New Features:**
- ✅ Clean exports (no UI controls in images)
- ✅ Drag & drop JSON import
- ✅ Manual import button
- ✅ Visual feedback (blue overlay)
- ✅ Safety confirmations
- ✅ Empty state hints

**All Export Formats:**
- 🖼️ PNG (clean)
- 📄 PDF (clean)
- 💾 JSON (full data)

**All Import Methods:**
- 🎯 Drag & Drop
- 🔘 Import Button
- 📥 Load from localStorage

---

**Ready to try?** Just refresh your frontend and start exporting/importing! 🚀

