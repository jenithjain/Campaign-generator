import React, { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Upload } from 'lucide-react';

import useWorkflowStore from '../../store/workflowStore';
import AgentNode from './AgentNode';
import Sidebar from './Sidebar';
import WorkflowNavbar from './WorkflowNavbar';
import { agentAPI } from '../../api/agentAPI';

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

  // Memoize nodeTypes to avoid React Flow warning
  const nodeTypes = useMemo(() => ({
    agentNode: AgentNode,
  }), []);

  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle file drag over for JSON import
  const onFileDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(true);
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onFileDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);
  }, []);

  // Handle file drop for JSON import
  const onFileDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if it's a JSON file
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const workflowData = JSON.parse(e.target.result);
            
            // Validate workflow structure
            if (workflowData.nodes && workflowData.edges) {
              // Clear current workflow
              if (nodes.length > 0) {
                if (confirm('This will replace your current workflow. Continue?')) {
                  useWorkflowStore.getState().setNodes(workflowData.nodes);
                  useWorkflowStore.getState().setEdges(workflowData.edges);
                  if (workflowData.name) {
                    useWorkflowStore.getState().setWorkflowName(workflowData.name);
                  }
                  alert('✅ Workflow imported successfully!');
                }
              } else {
                useWorkflowStore.getState().setNodes(workflowData.nodes);
                useWorkflowStore.getState().setEdges(workflowData.edges);
                if (workflowData.name) {
                  useWorkflowStore.getState().setWorkflowName(workflowData.name);
                }
                alert('✅ Workflow imported successfully!');
              }
            } else {
              alert('❌ Invalid workflow file. Missing nodes or edges.');
            }
          } catch (error) {
            alert('❌ Failed to import workflow: ' + error.message);
          }
        };
        
        reader.readAsText(file);
      } else {
        alert('❌ Please drop a valid JSON workflow file.');
      }
    }
  }, [nodes]);

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
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const runWorkflow = async () => {
    // Get fresh state from store
    const currentNodes = useWorkflowStore.getState().nodes;
    const currentEdges = useWorkflowStore.getState().edges;

    if (currentNodes.length === 0) {
      alert('❌ Add some agents to the workflow first!');
      return;
    }

    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 WORKFLOW EXECUTION STARTED');
    console.log('═══════════════════════════════════════════════════');

    setIsRunning(true);

    try {
      const executionOrder = getExecutionOrder();
      
      if (executionOrder.length === 0) {
        throw new Error('No nodes to execute. Make sure nodes are properly connected.');
      }

      console.log(`\n📋 Execution Plan:`);
      executionOrder.forEach((node, i) => {
        console.log(`   ${i + 1}. ${node.data.label} (${node.id})`);
      });
      console.log('\n');

      // Reset all nodes to idle state
      console.log('🔄 Resetting all nodes...');
      for (const node of executionOrder) {
        updateNode(node.id, { status: 'idle', output: null });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Execute each node in order
      for (let i = 0; i < executionOrder.length; i++) {
        const node = executionOrder[i];
        
        console.log(`\n${'='.repeat(50)}`);
        console.log(`▶️  STEP ${i + 1}/${executionOrder.length}: ${node.data.label}`);
        console.log(`${'='.repeat(50)}`);

        // Get fresh node data from store
        const freshNodes = useWorkflowStore.getState().nodes;
        const freshNode = freshNodes.find(n => n.id === node.id);

        // Get input from connected nodes
        const incomingEdges = currentEdges.filter(e => e.target === node.id);
        let combinedInput = freshNode?.data?.input || '';

        if (incomingEdges.length > 0) {
          console.log(`📥 Collecting input from ${incomingEdges.length} upstream node(s)...`);
          
          const sourceOutputs = incomingEdges
            .map(edge => {
              const sourceNode = freshNodes.find(n => n.id === edge.source);
              const output = sourceNode?.data?.output;
              
              if (!output) {
                console.log(`   ⚠️  No output from ${sourceNode?.data?.label || 'unknown node'}`);
                return '';
              }

              console.log(`   ✓ Received from ${sourceNode.data.label}`);
              
              // If output is an object, convert to readable string
              if (typeof output === 'object') {
                return JSON.stringify(output, null, 2);
              }
              return String(output);
            })
            .filter(Boolean);

          if (sourceOutputs.length > 0) {
            combinedInput = sourceOutputs.join('\n\n---\n\n') + (combinedInput ? '\n\n' + combinedInput : '');
            console.log(`   📝 Combined input length: ${combinedInput.length} characters`);
          }
        } else {
          console.log(`📝 Using node's own input: "${combinedInput.substring(0, 50)}${combinedInput.length > 50 ? '...' : ''}"`);
        }

        // Update node status to running
        updateNode(node.id, { 
          status: 'running', 
          output: '⏳ Processing...' 
        });

        console.log(`⚙️  Executing ${node.data.label}...`);

        try {
          // Execute the agent using agentAPI directly
          const agentType = freshNode?.data?.agentType;
          
          if (!agentType) {
            throw new Error(`Node ${node.data.label} is missing agentType`);
          }

          console.log(`   Agent Type: ${agentType}`);
          const result = await agentAPI.runAgent(agentType, combinedInput);
          
          console.log(`✅ ${node.data.label} completed successfully!`);
          console.log(`   Output type: ${typeof result}`);
          
          // Update node with result
          updateNode(node.id, {
            status: 'success',
            output: result,
            lastRun: new Date().toISOString(),
          });

          // Wait a bit for visual feedback and state update
          await new Promise(resolve => setTimeout(resolve, 800));
          
        } catch (error) {
          console.error(`❌ ${node.data.label} FAILED!`);
          console.error(`   Error: ${error.message}`);
          console.error(`   Stack:`, error.stack);
          
          updateNode(node.id, {
            status: 'error',
            output: `Error: ${error.message}`,
          });
          
          throw error;
        }
      }

      console.log(`\n${'='.repeat(50)}`);
      console.log('✨ WORKFLOW COMPLETED SUCCESSFULLY!');
      console.log(`${'='.repeat(50)}`);
      console.log(`✓ Executed ${executionOrder.length} agent(s)`);
      console.log(`✓ Time: ${new Date().toLocaleTimeString()}`);
      
      alert(`✨ Workflow completed successfully!\n\n• Executed ${executionOrder.length} agent(s)\n• All nodes processed in sequence\n• Check console for details`);
      
    } catch (error) {
      console.error('\n❌ WORKFLOW FAILED!');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      alert(`❌ Workflow execution failed:\n\n${error.message}\n\nCheck the browser console (F12) for detailed logs.`);
    } finally {
      setIsRunning(false);
      console.log('\n' + '═'.repeat(50) + '\n');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <WorkflowNavbar 
        onRunWorkflow={runWorkflow} 
        isRunning={isRunning}
        reactFlowWrapper={reactFlowWrapper}
        reactFlowInstance={reactFlowInstance}
      />

      <div 
        className="flex flex-1 overflow-hidden"
        onDragOver={onFileDragOver}
        onDragLeave={onFileDragLeave}
        onDrop={onFileDrop}
      >
        <Sidebar />

        <div className="flex-1 bg-slate-800 relative" ref={reactFlowWrapper}>
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

          {/* File drop overlay */}
          {isDraggingFile && (
            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-4 border-dashed border-blue-400 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-slate-800/90 p-8 rounded-xl border border-blue-400 shadow-2xl">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Drop Workflow JSON Here
                  </h3>
                  <p className="text-gray-300">
                    Import and load your saved workflow
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty state message */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400 bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl border border-slate-600">
            <h3 className="text-xl font-bold mb-2 text-white">
              Start Building Your Workflow
            </h3>
            <p className="text-sm mb-4">
              Drag agents from the sidebar and drop them here
            </p>
            <div className="text-xs text-gray-500 pt-4 border-t border-slate-600">
              <Upload className="w-4 h-4 inline mr-1" />
              Or drag & drop a workflow JSON file to import
            </div>
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

