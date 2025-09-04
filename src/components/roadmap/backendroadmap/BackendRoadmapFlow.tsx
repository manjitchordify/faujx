'use client';
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, initialEdges, moduleDetails } from './data/roadmapData';
import NodeDetailsPanel from './NodeDetailsPanel';
import RoadmapHeader from './RoadmapHeader';

interface NodeData {
  label: React.ReactNode;
}

const CustomNodeWithHandles: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ opacity: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        style={{ opacity: 0 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="target-right"
        style={{ opacity: 0 }}
      />

      <div>{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  customWithHandles: CustomNodeWithHandles,
};

type ModuleDetail = {
  title: string;
  content: string[];
  assignment: string | null;
};

export default function BackendRoadmapFlow() {
  const [nodes, , onNodesChange] = useNodesState(
    initialNodes.map(node => ({
      ...node,
      type: 'customWithHandles',
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const getNodeDetails = (nodeId: string): ModuleDetail | null => {
    return moduleDetails[nodeId as keyof typeof moduleDetails] || null;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <RoadmapHeader />

      <NodeDetailsPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
        getNodeDetails={getNodeDetails}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitViewOptions={{ padding: 0.1, minZoom: 0.5, maxZoom: 2 }}
      >
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node: Node) => {
            if (node.id.includes('assignment')) return '#4caf50';
            if (
              node.id.includes('module-10') ||
              node.id.includes('module-11') ||
              node.id.includes('optional')
            )
              return '#7b1fa2';
            if (node.id.includes('capstone')) return '#d32f2f';
            return '#1976d2';
          }}
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e0e0e0"
        />
      </ReactFlow>
    </div>
  );
}
