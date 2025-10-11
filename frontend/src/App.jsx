import React, { useState } from 'react';
import BriefInput from './components/BriefInput';
import CampaignCanvas from './components/CampaignCanvas';
import { Sparkles } from 'lucide-react';

function App() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              AI Campaign Generator
            </h1>
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
