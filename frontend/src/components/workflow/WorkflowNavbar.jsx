import React, { useState, useRef } from 'react';
import { Play, Save, Download, Upload, RefreshCw, Sparkles, Loader2, Image, FileText, FileUp } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import { exportWorkflowAsPNG, exportWorkflowAsPDF, exportWorkflowData } from '../../utils/exportWorkflow';

function WorkflowNavbar({ onRunWorkflow, isRunning, reactFlowWrapper, reactFlowInstance }) {
  const { workflowName, setWorkflowName, saveWorkflow, loadWorkflow, clearWorkflow, nodes, edges, setNodes, setEdges } = useWorkflowStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    setIsSaving(true);
    saveWorkflow();
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleLoad = () => {
    const loaded = loadWorkflow();
    if (loaded) {
      alert('Workflow loaded successfully!');
    } else {
      alert('No saved workflow found.');
    }
  };

  const handleExportJSON = () => {
    exportWorkflowData(nodes, edges, workflowName);
    setShowExportMenu(false);
  };

  const handleExportPNG = async () => {
    if (reactFlowWrapper?.current) {
      await exportWorkflowAsPNG(reactFlowWrapper.current, workflowName);
      setShowExportMenu(false);
    } else {
      alert('Canvas not ready. Please try again.');
    }
  };

  const handleExportPDF = async () => {
    if (reactFlowWrapper?.current) {
      await exportWorkflowAsPDF(reactFlowWrapper.current, workflowName);
      setShowExportMenu(false);
    } else {
      alert('Canvas not ready. Please try again.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('❌ Please select a valid JSON workflow file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflowData = JSON.parse(e.target.result);
        
        if (workflowData.nodes && workflowData.edges) {
          if (nodes.length > 0) {
            if (confirm('This will replace your current workflow. Continue?')) {
              setNodes(workflowData.nodes);
              setEdges(workflowData.edges);
              if (workflowData.name) {
                setWorkflowName(workflowData.name);
              }
              alert('✅ Workflow imported successfully!');
            }
          } else {
            setNodes(workflowData.nodes);
            setEdges(workflowData.edges);
            if (workflowData.name) {
              setWorkflowName(workflowData.name);
            }
            alert('✅ Workflow imported successfully!');
          }
        } else {
          alert('❌ Invalid workflow file. Missing nodes or edges.');
        }
      } catch (error) {
        alert('❌ Failed to import workflow: ' + error.message);
      }
    };
    
    reader.readAsText(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  return (
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6" style={{ color: 'rgb(173, 248, 45)' }} />
        <div>
          {showNameEdit ? (
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onBlur={() => setShowNameEdit(false)}
              onKeyDown={(e) => e.key === 'Enter' && setShowNameEdit(false)}
              className="bg-white/10 text-white px-2 py-1 rounded border border-white/20 focus:outline-none backdrop-blur-md"
              style={{ focusBorderColor: 'rgb(173, 248, 45)' }}
              autoFocus
            />
          ) : (
            <h1 
              className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setShowNameEdit(true)}
            >
              {workflowName}
            </h1>
          )}
          <p className="text-xs text-white/60">BrandMind AI Workflow Builder</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-white/20"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saved!' : 'Save'}
        </button>

        {/* Load */}
        <button
          onClick={handleLoad}
          className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-white/20"
        >
          <Upload className="w-4 h-4" />
          Load
        </button>

        {/* Import JSON */}
        <button
          onClick={handleImportClick}
          className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-white/20"
          title="Import workflow from JSON file"
        >
          <FileUp className="w-4 h-4" />
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileImport}
          className="hidden"
        />

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-white/20"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Export dropdown menu */}
          {showExportMenu && (
            <div className="absolute top-full mt-2 right-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50 min-w-[200px]">
              <button
                onClick={handleExportPNG}
                className="w-full px-4 py-2 text-left hover:bg-white/20 text-white flex items-center gap-2 text-sm transition-all rounded-t-lg"
              >
                <Image className="w-4 h-4" />
                Export as PNG
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full px-4 py-2 text-left hover:bg-white/20 text-white flex items-center gap-2 text-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full px-4 py-2 text-left hover:bg-white/20 text-white flex items-center gap-2 text-sm transition-all rounded-b-lg"
              >
                <Download className="w-4 h-4" />
                Export as JSON
              </button>
            </div>
          )}
        </div>

        {/* Clear */}
        <button
          onClick={() => {
            if (confirm('Clear all nodes? This cannot be undone.')) {
              clearWorkflow();
            }
          }}
          className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-red-500/20 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium border border-white/20 hover:border-red-500/50"
        >
          <RefreshCw className="w-4 h-4" />
          Clear
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/20 mx-2" />

        {/* Run Workflow - Prominent Start Button */}
        <button
          onClick={onRunWorkflow}
          disabled={isRunning}
          className={`
            px-8 py-2.5 rounded-full font-bold text-base flex items-center gap-2 
            transition-all shadow-lg transform hover:scale-105
            ${isRunning
              ? 'bg-gray-600 cursor-not-allowed animate-pulse text-white'
              : 'text-black'
            }
          `}
          style={{
            backgroundColor: isRunning ? undefined : 'rgb(173, 248, 45)',
          }}
          title="Execute all connected agents in sequence"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-black" />
              Start Workflow
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

export default WorkflowNavbar;

