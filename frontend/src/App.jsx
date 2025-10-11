import React, { useState } from 'react';
import BriefInput from './components/BriefInput';
import CampaignCanvas from './components/CampaignCanvas';
import WorkflowBuilder from './components/workflow/WorkflowBuilder';
import { Sparkles, Workflow, Zap } from 'lucide-react';

function App() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('simple'); // 'simple' or 'workflow'

  // Workflow mode - full screen
  if (mode === 'workflow') {
    return <WorkflowBuilder />;
  }

  // Simple mode - original interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  BrandMind AI
                </h1>
                <p className="text-xs text-gray-500">Campaign Generator</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMode('simple')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${mode === 'simple'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Zap className="w-4 h-4" />
                Quick Mode
              </button>
              <button
                onClick={() => setMode('workflow')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                  ${mode === 'workflow'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Workflow className="w-4 h-4" />
                Workflow Builder
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!campaign ? (
          <BriefInput 
            onCampaignGenerated={setCampaign} 
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <CampaignCanvas 
            campaign={campaign} 
            onCampaignUpdate={setCampaign}
            onReset={() => setCampaign(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
