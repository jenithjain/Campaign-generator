import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Mock responses for development - replace with real API calls later
const mockAgentResponses = {
  strategy: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          core_concept: 'Eco-friendly lifestyle brand positioning',
          tagline: 'Brew Better, Live Better',
          target_audience: 'Environmentally conscious Gen Z and Millennials',
          key_messages: [
            'Sustainable sourcing',
            'Zero waste packaging',
            'Community impact',
          ],
          tone: 'Authentic, energetic, and purpose-driven',
          channels: ['Instagram', 'TikTok', 'LinkedIn'],
        });
      }, 1500);
    });
  },

  copywriting: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          captions: [
            '🌱 Every cup tells a story. What\'s yours? #SustainableLiving',
            '☕ Good vibes only. Better coffee always. Join the movement! 🌍',
            'Your daily ritual just got an upgrade. ✨ Sustainable. Delicious. Ethical.',
          ],
          cta: 'Shop Now & Save The Planet',
          hashtags: '#EcoFriendly #SustainableCoffee #GreenLiving',
        });
      }, 1200);
    });
  },

  visual: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          image_concepts: [
            'Hero shot: Coffee cup with lush green background',
            'Lifestyle: Young professional enjoying coffee outdoors',
            'Product flat lay: Coffee bag with eco-friendly elements',
          ],
          color_palette: ['#2D5016', '#8DB600', '#F4E4C1', '#6B4423'],
          style: 'Natural, warm, Instagram-worthy',
          status: 'Concepts ready for generation',
        });
      }, 2000);
    });
  },

  research: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          trends: [
            'Sustainability is the #1 purchase driver for Gen Z',
            'Video content gets 5x more engagement',
            'User-generated content builds trust',
          ],
          competitors: ['Blue Bottle', 'Death Wish Coffee', 'Verve Coffee'],
          influencers: [
            '@sustainablesam (120K followers)',
            '@ecofriendlyliving (85K followers)',
          ],
          best_posting_times: ['7-9 AM', '12-1 PM', '7-9 PM'],
        });
      }, 1800);
    });
  },

  media: (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          schedule: [
            { date: '2025-10-15', platform: 'Instagram', content: 'Launch post' },
            { date: '2025-10-16', platform: 'TikTok', content: 'Behind the scenes' },
            { date: '2025-10-17', platform: 'Instagram', content: 'User testimonial' },
          ],
          budget_allocation: {
            'Instagram Ads': '40%',
            'TikTok Ads': '30%',
            'Influencer Partnerships': '20%',
            'Content Creation': '10%',
          },
          kpis: ['Reach: 100K', 'Engagement: 5%', 'Conversions: 1000'],
        });
      }, 1600);
    });
  },
};

export const agentAPI = {
  // Run individual agent
  runAgent: async (agentType, input) => {
    console.log(`Running ${agentType} agent with input:`, input);

    // For now, use mock responses
    // Later, replace with real API calls:
    /*
    const response = await axios.post(`${API_BASE_URL}/api/agent/run`, {
      agent_type: agentType,
      input: input,
    });
    return response.data.result;
    */

    if (mockAgentResponses[agentType]) {
      return await mockAgentResponses[agentType](input);
    }

    throw new Error(`Unknown agent type: ${agentType}`);
  },

  // Run full workflow (optional - for backend orchestration)
  runWorkflow: async (workflowData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/workflow/run`, workflowData);
      return response.data;
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  },

  // Save workflow to backend (optional)
  saveWorkflow: async (workflowData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/workflow/save`, workflowData);
      return response.data;
    } catch (error) {
      console.error('Workflow save failed:', error);
      throw error;
    }
  },
};

// Real API integration functions (comment out the mock ones above when ready)
export const realAgentAPI = {
  strategy: async (input) => {
    const response = await axios.post(`${API_BASE_URL}/api/agent/strategy`, { input });
    return response.data;
  },

  copywriting: async (input) => {
    const response = await axios.post(`${API_BASE_URL}/api/agent/copywriting`, { input });
    return response.data;
  },

  visual: async (input) => {
    const response = await axios.post(`${API_BASE_URL}/api/agent/visual`, { input });
    return response.data;
  },

  research: async (input) => {
    const response = await axios.post(`${API_BASE_URL}/api/agent/research`, { input });
    return response.data;
  },

  media: async (input) => {
    const response = await axios.post(`${API_BASE_URL}/api/agent/media`, { input });
    return response.data;
  },
};

