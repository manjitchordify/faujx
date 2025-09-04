import React from 'react';
import { Node } from 'reactflow';

// Define the module details type based on your data structure
type ModuleDetail = {
  title: string;
  content: string[];
  assignment: string | null;
};

// Define the props interface
interface NodeDetailsPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
  getNodeDetails: (nodeId: string) => ModuleDetail | null;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  selectedNode,
  onClose,
  getNodeDetails,
}) => {
  if (!selectedNode) return null;

  const details = getNodeDetails(selectedNode.id);

  return (
    <div className="absolute top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg max-w-sm border">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
      >
        ×
      </button>
      {details ? (
        <div className="text-black">
          <h3 className="font-bold text-sm mb-2">{details.title}</h3>
          <div className="text-xs space-y-1">
            <div>
              <strong>Topics:</strong>
            </div>
            <ul className="list-disc list-inside ml-2">
              {details.content.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            {details.assignment && (
              <div className="mt-2">
                <strong>Assignment:</strong>
                <p className="text-gray-700">{details.assignment}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-black">Click on a node to see details</div>
      )}
    </div>
  );
};

export default NodeDetailsPanel;
