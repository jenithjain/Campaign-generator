/**
 * Format agent output from JSON to readable markdown
 */

export function formatAgentOutput(output, agentType) {
  if (!output) return '';
  
  // If it's a string, return as-is
  if (typeof output === 'string') {
    return output;
  }

  // If it's not an object, convert to string
  if (typeof output !== 'object') {
    return String(output);
  }

  // Format based on agent type
  switch (agentType) {
    case 'strategy':
      return formatStrategyOutput(output);
    case 'copywriting':
      return formatCopywritingOutput(output);
    case 'visual':
      return formatVisualOutput(output);
    case 'research':
      return formatResearchOutput(output);
    case 'media':
      return formatMediaOutput(output);
    default:
      return formatGenericOutput(output);
  }
}

function formatStrategyOutput(data) {
  let md = '### 🎯 Campaign Strategy\n\n';
  
  if (data.core_concept) {
    md += `**Core Concept:** ${data.core_concept}\n\n`;
  }
  
  if (data.tagline) {
    md += `**Tagline:** _"${data.tagline}"_\n\n`;
  }
  
  if (data.target_audience) {
    md += `**Target Audience:** ${data.target_audience}\n\n`;
  }
  
  if (data.key_messages && Array.isArray(data.key_messages)) {
    md += '**Key Messages:**\n';
    data.key_messages.forEach((msg, i) => {
      md += `${i + 1}. ${msg}\n`;
    });
    md += '\n';
  }
  
  if (data.tone) {
    md += `**Tone:** ${data.tone}\n\n`;
  }
  
  if (data.channels && Array.isArray(data.channels)) {
    md += `**Channels:** ${data.channels.join(', ')}\n`;
  }
  
  return md;
}

function formatCopywritingOutput(data) {
  let md = '### ✍️ Marketing Copy\n\n';
  
  if (data.captions && Array.isArray(data.captions)) {
    md += '**Social Media Captions:**\n\n';
    data.captions.forEach((caption, i) => {
      md += `${i + 1}. ${caption}\n\n`;
    });
  }
  
  if (data.cta) {
    md += `**Call to Action:** ${data.cta}\n\n`;
  }
  
  if (data.hashtags) {
    md += `**Hashtags:** ${data.hashtags}\n`;
  }
  
  return md;
}

function formatVisualOutput(data) {
  let md = '### 🎨 Visual Design Concepts\n\n';
  
  if (data.image_concepts && Array.isArray(data.image_concepts)) {
    md += '**Image Concepts:**\n';
    data.image_concepts.forEach((concept, i) => {
      md += `${i + 1}. ${concept}\n`;
    });
    md += '\n';
  }
  
  if (data.color_palette && Array.isArray(data.color_palette)) {
    md += '**Color Palette:**\n';
    data.color_palette.forEach((color) => {
      md += `• ${color}\n`;
    });
    md += '\n';
  }
  
  if (data.style) {
    md += `**Style:** ${data.style}\n\n`;
  }
  
  if (data.status) {
    md += `_${data.status}_\n`;
  }
  
  return md;
}

function formatResearchOutput(data) {
  let md = '### 🔍 Market Research\n\n';
  
  if (data.trends && Array.isArray(data.trends)) {
    md += '**Key Trends:**\n';
    data.trends.forEach((trend) => {
      md += `• ${trend}\n`;
    });
    md += '\n';
  }
  
  if (data.competitors && Array.isArray(data.competitors)) {
    md += `**Competitors:** ${data.competitors.join(', ')}\n\n`;
  }
  
  if (data.influencers && Array.isArray(data.influencers)) {
    md += '**Recommended Influencers:**\n';
    data.influencers.forEach((influencer) => {
      md += `• ${influencer}\n`;
    });
    md += '\n';
  }
  
  if (data.best_posting_times && Array.isArray(data.best_posting_times)) {
    md += `**Best Posting Times:** ${data.best_posting_times.join(', ')}\n`;
  }
  
  return md;
}

function formatMediaOutput(data) {
  let md = '### 📊 Media Plan\n\n';
  
  if (data.schedule && Array.isArray(data.schedule)) {
    md += '**Posting Schedule:**\n\n';
    data.schedule.forEach((item) => {
      md += `📅 **${item.date}** - ${item.platform}\n`;
      md += `   ${item.content}\n\n`;
    });
  }
  
  if (data.budget_allocation) {
    md += '**Budget Allocation:**\n';
    Object.entries(data.budget_allocation).forEach(([channel, percent]) => {
      md += `• ${channel}: ${percent}\n`;
    });
    md += '\n';
  }
  
  if (data.kpis && Array.isArray(data.kpis)) {
    md += '**KPIs:**\n';
    data.kpis.forEach((kpi) => {
      md += `• ${kpi}\n`;
    });
  }
  
  return md;
}

function formatGenericOutput(data) {
  let md = '';
  
  // Handle arrays
  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      if (typeof item === 'object') {
        md += formatGenericOutput(item);
      } else {
        md += `${i + 1}. ${item}\n`;
      }
    });
    return md;
  }
  
  // Handle objects
  Object.entries(data).forEach(([key, value]) => {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (Array.isArray(value)) {
      md += `**${formattedKey}:**\n`;
      value.forEach((item) => {
        if (typeof item === 'object') {
          md += formatGenericOutput(item);
        } else {
          md += `• ${item}\n`;
        }
      });
      md += '\n';
    } else if (typeof value === 'object' && value !== null) {
      md += `**${formattedKey}:**\n`;
      md += formatGenericOutput(value);
      md += '\n';
    } else {
      md += `**${formattedKey}:** ${value}\n\n`;
    }
  });
  
  return md;
}

/**
 * Parse markdown to HTML for better rendering
 */
export function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold mt-2 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold mt-3 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mt-4 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\d+\.\s(.+)$/gim, '<div class="ml-2">$&</div>')
    .replace(/^[•\-]\s(.+)$/gim, '<div class="ml-2">$&</div>')
    // Line breaks
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>');
}

