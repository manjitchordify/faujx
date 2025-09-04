import { Handle, Position } from '@xyflow/react';
import { MODULE } from '@/constants/roadmap';
import { NodeItemData } from '@/types/roadmap';

type Props = {
  data: NodeItemData;
};

const Module = ({ data }: Props) => {
  return (
    <div
      style={
        {
          cursor: 'pointer',
          backgroundColor: '#fdff00',
          padding: '5px 10px',
          border: '2px solid black',
          borderRadius: '5px',
          width: MODULE.WIDTH,
          height: MODULE.HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '--hover-color': '#d6d700',
        } as React.CSSProperties
      }
    >
      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{data.label}</div>

      {/* Define handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: 'transparent', border: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: 'transparent', border: 'none' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: 'transparent', border: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: 'transparent', border: 'none' }}
      />
    </div>
  );
};

export default Module;
