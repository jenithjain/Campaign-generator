import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useWorkflowStore from '../../store/workflowStore';
import AgentNode from './AgentNode';
import Sidebar from './Sidebar';
import WorkflowNavbar from './WorkflowNavbar';
import { agentAPI } from '../../api/agentAPI';

const nodeTypes = {
  agentNode: AgentNode,
};

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

function WorkflowBuilderInner() {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    getExecutionOrder,
  } = useWorkflowStore();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const agentData = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      if (!agentData || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create agent-specific run function
      const runFunction = async (input) => {
        return await agentAPI.runAgent(agentData.type, input);
      };

      const newNode = {
        id: getNodeId(),
        type: 'agentNode',
        position,
        data: {
          label: agentData.label,
          agentType: agentData.type,
          status: 'idle',
          input: '',
          output: null,
          showInput: true,
          onRun: runFunction,
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const runWorkflow = async () => {
    if (nodes.length === 0) {
      alert('Add some agents to the workflow first!');
      return;
    }

    setIsRunning(true);

    try {
      const executionOrder = getExecutionOrder();
      console.log('Execution order:', executionOrder.map(n => n.data.label));

      for (const node of executionOrder) {
        // Get input from connected nodes
        const incomingEdges = edges.filter(e => e.target === node.id);
        let combinedInput = node.data.input || '';

        if (incomingEdges.length > 0) {
          const sourceOutputs = incomingEdges
            .map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              return sourceNode?.data?.output || '';
            })
            .filter(Boolean);

          if (sourceOutputs.length > 0) {
            combinedInput = sourceOutputs.join('\n\n') + '\n\n' + combinedInput;
          }
        }

        // Run the node
        updateNode(node.id, { status: 'running', output: 'Processing...' });

        try {
          const result = await node.data.onRun(combinedInput);
          updateNode(node.id, {
            status: 'success',
            output: result,
            lastRun: new Date().toISOString(),
          });

          // Small delay between nodes
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          updateNode(node.id, {
            status: 'error',
            output: `Error: ${error.message}`,
          });
          throw error;
        }
      }

      alert('Workflow completed successfully! ✨');
    } catch (error) {
      alert(`Workflow failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <WorkflowNavbar onRunWorkflow={runWorkflow} isRunning={isRunning} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 bg-slate-800" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background color="#475569" gap={16} />
            <Controls className="bg-slate-700 border-slate-600" />
            <MiniMap
              nodeColor={(node) => {
                const colors = {
                  strategy: '#4ade80',
                  copywriting: '#60a5fa',
                  visual: '#fb923c',
                  research: '#a78bfa',
                  media: '#f472b6',
                };
                return colors[node.data.agentType] || '#64748b';
              }}
              className="bg-slate-700 border-slate-600"
              maskColor="rgba(0, 0, 0, 0.3)"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Empty state message */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400 bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-600">
            <h3 className="text-xl font-bold mb-2 text-white">
              Start Building Your Workflow
            </h3>
            <p className="text-sm">
              Drag agents from the sidebar and drop them here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
}

export default WorkflowBuilder;

