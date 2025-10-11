import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useWorkflowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  workflowName: 'Untitled Workflow',
  
  // Node management
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#5B9DFE' } }, get().edges),
    });
  },
  
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  
  updateNode: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },
  
  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },
  
  // Workflow management
  setWorkflowName: (name) => set({ workflowName: name }),
  
  saveWorkflow: () => {
    const workflow = {
      name: get().workflowName,
      nodes: get().nodes,
      edges: get().edges,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('brandmind_workflow', JSON.stringify(workflow));
    return workflow;
  },
  
  loadWorkflow: () => {
    const saved = localStorage.getItem('brandmind_workflow');
    if (saved) {
      const workflow = JSON.parse(saved);
      set({
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        workflowName: workflow.name || 'Untitled Workflow',
      });
      return true;
    }
    return false;
  },
  
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      workflowName: 'Untitled Workflow',
    });
  },
  
  // Get execution order based on connections
  getExecutionOrder: () => {
    const nodes = get().nodes;
    const edges = get().edges;
    
    // Simple topological sort
    const order = [];
    const visited = new Set();
    const inDegree = new Map();
    
    // Calculate in-degrees
    nodes.forEach(node => inDegree.set(node.id, 0));
    edges.forEach(edge => {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });
    
    // Find nodes with no dependencies
    const queue = nodes.filter(node => inDegree.get(node.id) === 0);
    
    while (queue.length > 0) {
      const node = queue.shift();
      order.push(node);
      visited.add(node.id);
      
      // Find dependent nodes
      edges
        .filter(edge => edge.source === node.id)
        .forEach(edge => {
          inDegree.set(edge.target, inDegree.get(edge.target) - 1);
          if (inDegree.get(edge.target) === 0) {
            const nextNode = nodes.find(n => n.id === edge.target);
            if (nextNode) queue.push(nextNode);
          }
        });
    }
    
    return order;
  },
}));

export default useWorkflowStore;

