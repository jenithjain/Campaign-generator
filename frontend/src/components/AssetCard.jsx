import React, { useState } from 'react';
import { RefreshCw, Edit2, Image, FileText, Video, MessageCircle } from 'lucide-react';

function AssetCard({ asset, onRegenerate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(asset.content || '');
  const [regenerateInstructions, setRegenerateInstructions] = useState('');
  const [showRegenerateInput, setShowRegenerateInput] = useState(false);

  const getIcon = () => {
    switch (asset.type) {
      case 'image':
      case 'flyer':
        return <Image className="w-5 h-5" />;
      case 'video_script':
        return <Video className="w-5 h-5" />;
      case 'caption':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    return asset.type.replace('_', ' ').toUpperCase();
  };

  const handleRegenerate = () => {
    if (showRegenerateInput && regenerateInstructions.trim()) {
      onRegenerate(asset.id, regenerateInstructions);
      setRegenerateInstructions('');
      setShowRegenerateInput(false);
    } else {
      setShowRegenerateInput(true);
    }
  };

  return (
    <div className="border border-white/20 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:border-white/30 transition-all">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-white">{getIcon()}</span>
          <span className="font-semibold text-sm text-white">{getTypeLabel()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">v{asset.version}</span>
          {!asset.safety.moderation_passed && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30">
              Safety Issue
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {asset.type === 'image' || asset.type === 'flyer' ? (
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {asset.url ? (
              <img
                src={asset.url}
                alt={asset.id}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Image className="w-12 h-12" />
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[100px]">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-32 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[rgb(173,248,45)] focus:ring-2 focus:ring-[rgba(173,248,45,0.3)] resize-none text-sm"
              />
            ) : (
              <p className="text-white/90 text-sm whitespace-pre-wrap">
                {asset.content || 'No content generated'}
              </p>
            )}
          </div>
        )}

        {/* Regenerate Input */}
        {showRegenerateInput && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Modification instructions (optional)"
              value={regenerateInstructions}
              onChange={(e) => setRegenerateInstructions(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[rgb(173,248,45)] focus:ring-2 focus:ring-[rgba(173,248,45,0.3)] text-sm"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center gap-2">
        {asset.content && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-all border border-white/20"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        )}
        
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              // Here you would call an API to save the edited content
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-black font-semibold rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: 'rgb(173, 248, 45)' }}
          >
            Save
          </button>
        )}

        <button
          onClick={handleRegenerate}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-all border border-white/20 ml-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
      </div>
    </div>
  );
}

export default AssetCard;
