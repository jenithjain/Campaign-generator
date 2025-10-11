import React from 'react';
import { Target, FileText, Palette, Search, BarChart3 } from 'lucide-react';

const agentTypes = [
  {
    type: 'strategy',
    label: 'Strategy Agent',
    icon: Target,
    color: 'green',
    description: 'Defines campaign strategy and goals',
  },
  {
    type: 'copywriting',
    label: 'Copywriting Agent',
    icon: FileText,
    color: 'blue',
    description: 'Generates marketing copy and captions',
  },
  {
    type: 'visual',
    label: 'Visual Design Agent',
    icon: Palette,
    color: 'orange',
    description: 'Creates images and visual assets',
  },
  {
    type: 'research',
    label: 'Market Research Agent',
    icon: Search,
    color: 'purple',
    description: 'Researches trends and competitors',
  },
  {
    type: 'media',
    label: 'Media Planner Agent',
    icon: BarChart3,
    color: 'pink',
    description: 'Plans posting schedule and channels',
  },
];

const colorClasses = {
  green: 'border-green-400 bg-green-50 hover:bg-green-100 text-green-700',
  blue: 'border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700',
  orange: 'border-orange-400 bg-orange-50 hover:bg-orange-100 text-orange-700',
  purple: 'border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-700',
  pink: 'border-pink-400 bg-pink-50 hover:bg-pink-100 text-pink-700',
};

function Sidebar() {
  const onDragStart = (event, agentType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(agentType));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 bg-slate-900 text-gray-100 p-4 border-r border-slate-700 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2 text-white">Agent Blocks</h2>
        <p className="text-xs text-gray-400">
          Drag and drop agents onto the canvas to build your workflow
        </p>
      </div>

      <div className="space-y-3">
        {agentTypes.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.type}
              draggable
              onDragStart={(e) => onDragStart(e, agent)}
              className={`
                border-2 rounded-lg p-3 cursor-move transition-all
                ${colorClasses[agent.color]}
                hover:shadow-lg transform hover:scale-105
              `}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">
                    {agent.label}
                  </h3>
                  <p className="text-xs opacity-80">
                    {agent.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <h3 className="text-sm font-semibold mb-2 text-white">💡 Tips</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Connect nodes by dragging from one handle to another</li>
          <li>• Click "Run Agent" to execute individual nodes</li>
          <li>• Use "Run Workflow" to execute all connected nodes</li>
          <li>• Save your workflow to localStorage</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;

