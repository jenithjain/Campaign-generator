import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';

const agentStyles = {
  strategy: {
    border: 'border-green-400',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    icon: '🎯',
    glow: 'shadow-green-400/50',
  },
  copywriting: {
    border: 'border-blue-400',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    icon: '✍️',
    glow: 'shadow-blue-400/50',
  },
  visual: {
    border: 'border-orange-400',
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    icon: '🎨',
    glow: 'shadow-orange-400/50',
  },
  research: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    icon: '🔍',
    glow: 'shadow-purple-400/50',
  },
  media: {
    border: 'border-pink-400',
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
    icon: '📊',
    glow: 'shadow-pink-400/50',
  },
};

function AgentNode({ data, id }) {
  const { updateNode, removeNode } = useWorkflowStore();
  const style = agentStyles[data.agentType] || agentStyles.strategy;

  const handleRun = async () => {
    updateNode(id, { status: 'running', output: 'Processing...' });
    
    try {
      // Call the agent's run function
      if (data.onRun) {
        const result = await data.onRun(data.input || '');
        updateNode(id, { 
          status: 'success', 
          output: result,
          lastRun: new Date().toISOString()
        });
      }
    } catch (error) {
      updateNode(id, { 
        status: 'error', 
        output: `Error: ${error.message}` 
      });
    }
  };

  const handleDelete = () => {
    removeNode(id);
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        relative rounded-xl border-2 ${style.border} ${style.bg} 
        shadow-lg ${data.status === 'running' ? 'shadow-xl ' + style.glow : ''}
        transition-all duration-300 hover:scale-105
        min-w-[280px] max-w-[350px]
      `}
    >
      {/* Input Handle */}
      {data.agentType !== 'strategy' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-slate-600 border-2 border-white"
        />
      )}

      {/* Node Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{style.icon}</span>
            <h3 className="font-bold text-gray-800 text-sm">
              {data.label}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Area */}
        {data.showInput && (
          <div className="mb-3">
            <textarea
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 resize-none"
              placeholder={`Enter ${data.label.toLowerCase()} instructions...`}
              rows={2}
              value={data.input || ''}
              onChange={(e) => updateNode(id, { input: e.target.value })}
            />
          </div>
        )}

        {/* Run Button */}
        <button
          onClick={handleRun}
          disabled={data.status === 'running'}
          className={`
            w-full py-2 px-4 rounded-lg font-semibold text-sm
            flex items-center justify-center gap-2 transition-all
            ${data.status === 'running' 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-slate-800 hover:bg-slate-700 text-white shadow-md hover:shadow-lg'
            }
          `}
        >
          {data.status === 'running' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Agent
            </>
          )}
        </button>

        {/* Output Area */}
        {data.output && (
          <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-1">Output:</div>
            <div className="text-xs text-gray-700 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {typeof data.output === 'object' 
                ? JSON.stringify(data.output, null, 2) 
                : data.output}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-slate-600 border-2 border-white"
      />
    </div>
  );
}

export default memo(AgentNode);

