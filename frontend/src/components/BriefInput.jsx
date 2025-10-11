import React, { useState } from 'react';
import { api } from '../api';
import { Send, Loader2 } from 'lucide-react';

function BriefInput({ onCampaignGenerated, loading, setLoading }) {
  const [brief, setBrief] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!brief.trim()) {
      setError('Please enter a campaign brief');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await api.generateCampaign(brief);
      
      if (result.success) {
        onCampaignGenerated(result.campaign);
      } else {
        setError('Failed to generate campaign');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Glass-morphism Card */}
      <div 
        className="rounded-3xl backdrop-blur-md border shadow-2xl p-8 md:p-10"
        style={{
          backgroundColor: 'rgba(173, 248, 45, 0.1)',
          borderColor: 'rgba(173, 248, 45, 0.3)',
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Create Your Campaign
        </h2>
        <p className="text-white/80 mb-6 leading-relaxed">
          Describe your marketing campaign in a few sentences. Our AI will generate a complete strategy with visuals, copy, and media planning.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="brief" className="block text-sm font-medium text-white mb-2">
              Campaign Brief
            </label>
            <textarea
              id="brief"
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[rgb(173,248,45)] focus:ring-2 focus:ring-[rgba(173,248,45,0.3)] transition-all duration-200 resize-none"
              placeholder="Example: Launch a social media campaign for our new sustainable coffee brand targeting Gen Z in Mumbai for World Environment Day"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-full font-semibold text-black text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'rgb(173, 248, 45)',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Campaign...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Campaign
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="font-semibold text-white mb-2">What you'll get:</h3>
          <ul className="text-sm text-white/70 space-y-2">
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(173, 248, 45)' }}>✓</span>
              Strategic campaign concept and messaging
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(173, 248, 45)' }}>✓</span>
              Social media captions and content
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(173, 248, 45)' }}>✓</span>
              AI-generated visuals and graphics
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(173, 248, 45)' }}>✓</span>
              Instagram Reel scripts
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(173, 248, 45)' }}>✓</span>
              Influencer recommendations
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'rgb(173, 248, 45)' }}>✓</span>
              Posting calendar and media plan
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BriefInput;
