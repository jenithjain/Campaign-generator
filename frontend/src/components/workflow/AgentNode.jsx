import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, Loader2, CheckCircle, XCircle, Trash2, RotateCw } from 'lucide-react';
import useWorkflowStore from '../../store/workflowStore';
import { formatAgentOutput, markdownToHtml } from '../../utils/formatOutput';
import { agentAPI } from '../../api/agentAPI';

const agentStyles = {
  strategy: {
    border: 'border-[rgb(173,248,45)]',
    bg: 'bg-gradient-to-br from-[rgba(173,248,45,0.15)] to-[rgba(173,248,45,0.05)]',
    icon: '🎯',
    glow: 'shadow-[0_0_20px_rgba(173,248,45,0.5)]',
  },
  copywriting: {
    border: 'border-blue-400',
    bg: 'bg-gradient-to-br from-blue-400/15 to-blue-400/5',
    icon: '✍️',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.5)]',
  },
  visual: {
    border: 'border-orange-400',
    bg: 'bg-gradient-to-br from-orange-400/15 to-orange-400/5',
    icon: '🎨',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.5)]',
  },
  research: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-br from-purple-400/15 to-purple-400/5',
    icon: '🔍',
    glow: 'shadow-[0_0_20px_rgba(167,139,250,0.5)]',
  },
  media: {
    border: 'border-pink-400',
    bg: 'bg-gradient-to-br from-pink-400/15 to-pink-400/5',
    icon: '📊',
    glow: 'shadow-[0_0_20px_rgba(244,114,182,0.5)]',
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
        relative rounded-xl border-2 ${style.border} ${style.bg} backdrop-blur-md
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
          className="w-3 h-3 border-2 border-white"
          style={{ backgroundColor: 'rgb(173, 248, 45)' }}
        />
      )}

      {/* Node Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{style.icon}</span>
            <h3 className="font-bold text-white text-sm">
              {data.label}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <button
              onClick={handleDelete}
              className="text-white/60 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Area */}
        {data.showInput && (
          <div className="mb-3">
            <textarea
              className="w-full px-3 py-2 text-xs border border-white/20 rounded-lg focus:ring-2 focus:ring-[rgb(173,248,45)] focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/50 resize-none"
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
              flex items-center justify-center gap-2 transition-all hover:scale-105
              ${data.status === 'running' 
                ? 'bg-gray-600 text-white cursor-not-allowed' 
                : 'text-black shadow-md hover:shadow-lg'
              }
            `}
            style={{
              backgroundColor: data.status === 'running' ? undefined : 'rgb(173, 248, 45)',
            }}
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
              className="px-3 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
              title="Regenerate output"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Output Area */}
        {data.output && (
          <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="text-xs font-semibold text-white/80 mb-1">Output:</div>
            
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
                          ? 'border-[rgb(173,248,45)] shadow-lg'
                          : 'border-white/30 hover:border-[rgb(173,248,45)]'
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
                        <div className="absolute top-1 right-1 rounded-full p-1" style={{ backgroundColor: 'rgb(173, 248, 45)' }}>
                          <CheckCircle className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Image Details */}
                {data.output.selected_image && (
                  <div className="text-xs text-white/80 space-y-1">
                    <div><strong>Style:</strong> {data.output.style}</div>
                    <div><strong>Colors:</strong> {data.output.color_palette?.join(', ')}</div>
                  </div>
                )}
              </div>
            ) : (
              /* Regular markdown output for other agents */
              <div 
                className="text-xs text-white/90 max-h-32 overflow-y-auto prose prose-xs"
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
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: 'rgb(173, 248, 45)' }}
      />
    </div>
  );
}

export default memo(AgentNode);

