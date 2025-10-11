import React, { useState } from 'react';
import AssetCard from './AssetCard';
import ExportButton from './ExportButton';
import { ArrowLeft, Target, Users, MessageSquare, Calendar } from 'lucide-react';

function CampaignCanvas({ campaign, onCampaignUpdate, onReset }) {
  const [editingAsset, setEditingAsset] = useState(null);

  const strategy = campaign.strategy || {};
  const assets = campaign.asset_plan || [];
  const calendar = campaign.posting_calendar || [];
  const influencers = campaign.influencers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-white/80 hover:text-white backdrop-blur-md bg-white/10 px-4 py-2 rounded-lg border border-white/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          New Campaign
        </button>
        <ExportButton campaignId={campaign.campaign_id} />
      </div>

      {/* Strategy Section - Glass morphism */}
      <div 
        className="rounded-3xl backdrop-blur-md border shadow-2xl p-6"
        style={{
          backgroundColor: 'rgba(173, 248, 45, 0.1)',
          borderColor: 'rgba(173, 248, 45, 0.3)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6" style={{ color: 'rgb(173, 248, 45)' }} />
          <h2 className="text-2xl font-bold text-white">Campaign Strategy</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-2">Core Concept</h3>
            <p className="text-white/90 text-lg">{strategy.core_concept}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Tagline</h3>
            <p className="text-lg font-semibold" style={{ color: 'rgb(173, 248, 45)' }}>{strategy.tagline}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Target Audience</h3>
            <p className="text-white/80">{strategy.target_audience}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Tone</h3>
            <p className="text-white/80 capitalize">{strategy.tone}</p>
          </div>
        </div>

        {strategy.key_messages && strategy.key_messages.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Key Messages</h3>
            <ul className="list-disc list-inside space-y-1">
              {strategy.key_messages.map((msg, idx) => (
                <li key={idx} className="text-gray-900">{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Assets Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Campaign Assets</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onRegenerate={(assetId, instructions) => {
                // Handle regeneration
                console.log('Regenerate:', assetId, instructions);
              }}
            />
          ))}
        </div>
      </div>

      {/* Posting Calendar */}
      {calendar.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Posting Calendar</h2>
          </div>
          
          <div className="space-y-3">
            {calendar.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{item.date}</p>
                    <p className="text-sm text-gray-600">{item.channel}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Needs Approval
                  </span>
                </div>
                {item.caption && (
                  <p className="mt-2 text-gray-700 text-sm">{item.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Influencers */}
      {influencers.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended Influencers</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {influencers.map((influencer, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{influencer.name}</h3>
                <p className="text-sm text-gray-600">@{influencer.handle}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {influencer.platform} • {influencer.followers} followers
                </p>
                {influencer.outreach_draft && (
                  <p className="mt-2 text-sm text-gray-700 italic">
                    "{influencer.outreach_draft}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignCanvas;
