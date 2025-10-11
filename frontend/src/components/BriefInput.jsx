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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Create Your Campaign
        </h2>
        <p className="text-gray-600 mb-6">
          Describe your marketing campaign in a few sentences. Our AI will generate a complete strategy with visuals, copy, and media planning.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="brief" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Brief
            </label>
            <textarea
              id="brief"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Example: Launch a social media campaign for our new sustainable coffee brand targeting Gen Z in Mumbai for World Environment Day"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Strategic campaign concept and messaging</li>
            <li>• Social media captions and content</li>
            <li>• AI-generated visuals and graphics</li>
            <li>• Instagram Reel scripts</li>
            <li>• Influencer recommendations</li>
            <li>• Posting calendar and media plan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BriefInput;
