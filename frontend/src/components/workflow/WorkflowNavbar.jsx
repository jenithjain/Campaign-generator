import React, { useState } from 'react';
import { Play, Save, Download, Upload, RefreshCw, Sparkles } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';

function WorkflowNavbar({ onRunWorkflow, isRunning }) {
  const { workflowName, setWorkflowName, saveWorkflow, loadWorkflow, clearWorkflow } = useWorkflowStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);

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

  const handleExport = () => {
    const workflow = {
      name: workflowName,
      nodes: useWorkflowStore.getState().nodes,
      edges: useWorkflowStore.getState().edges,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-blue-400" />
        <div>
          {showNameEdit ? (
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onBlur={() => setShowNameEdit(false)}
              onKeyDown={(e) => e.key === 'Enter' && setShowNameEdit(false)}
              className="bg-slate-800 text-white px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-400"
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
          <p className="text-xs text-gray-400">BrandMind AI Workflow Builder</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-600"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saved!' : 'Save'}
        </button>

        {/* Load */}
        <button
          onClick={handleLoad}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-600"
        >
          <Upload className="w-4 h-4" />
          Load
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-600"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* Clear */}
        <button
          onClick={() => {
            if (confirm('Clear all nodes? This cannot be undone.')) {
              clearWorkflow();
            }
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-red-700 text-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
          Clear
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-700 mx-2" />

        {/* Run Workflow */}
        <button
          onClick={onRunWorkflow}
          disabled={isRunning}
          className={`
            px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 
            transition-all shadow-lg
            ${isRunning
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }
          `}
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Workflow'}
        </button>
      </div>
    </nav>
  );
}

export default WorkflowNavbar;

