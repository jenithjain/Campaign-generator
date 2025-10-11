import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, Loader2, CheckCircle, XCircle, Trash2, RotateCw } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import { formatAgentOutput, markdownToHtml } from '../../utils/formatOutput';
import { agentAPI } from '../../api/agentAPI';

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
    updateNode(id, { status: 'running', output: '⏳ Processing...' });
    
    try {
      // Call the agent API directly using agentType
      if (data.agentType) {
        const result = await agentAPI.runAgent(data.agentType, data.input || '');
        updateNode(id, { 
          status: 'success', 
          output: result,
          lastRun: new Date().toISOString()
        });
      } else {
        throw new Error('Agent type not found');
      }
    } catch (error) {
      updateNode(id, { 
        status: 'error', 
        output: `Error: ${error.message}` 
      });
    }
  };

  const handleRegenerate = async () => {
    // Clear previous output and run again
    updateNode(id, { output: null, status: 'idle' });
    await new Promise(resolve => setTimeout(resolve, 100));
    handleRun();
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={data.status === 'running'}
            className={`
              flex-1 py-2 px-4 rounded-lg font-semibold text-sm
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
                Run
              </>
            )}
          </button>

          {/* Regenerate Button - only show if there's output */}
          {data.output && data.status !== 'running' && (
            <button
              onClick={handleRegenerate}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
              title="Regenerate output"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Output Area */}
        {data.output && (
          <div className="mt-3 p-3 bg-white/60 rounded-lg border border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-1">Output:</div>
            
            {/* Special rendering for visual agent with images */}
            {data.agentType === 'visual' && data.output.type === 'visual_with_images' ? (
              <div>
                {/* Image Gallery */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {data.output.images?.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        img.selected
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        // Update selected image
                        const updatedOutput = {
                          ...data.output,
                          images: data.output.images.map((image, i) => ({
                            ...image,
                            selected: i === idx,
                          })),
                          selected_image: data.output.images[idx],
                        };
                        updateNode(id, { output: updatedOutput });
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Generated ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      {img.selected && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Image Details */}
                {data.output.selected_image && (
                  <div className="text-xs text-gray-700 space-y-1">
                    <div><strong>Style:</strong> {data.output.style}</div>
                    <div><strong>Colors:</strong> {data.output.color_palette?.join(', ')}</div>
                  </div>
                )}
              </div>
            ) : (
              /* Regular markdown output for other agents */
              <div 
                className="text-xs text-gray-700 max-h-32 overflow-y-auto prose prose-xs"
                dangerouslySetInnerHTML={{ 
                  __html: markdownToHtml(formatAgentOutput(data.output, data.agentType))
                }}
              />
            )}
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

