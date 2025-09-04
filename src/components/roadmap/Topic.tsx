import { Handle, Position } from '@xyflow/react';
import { TOPIC } from '@/constants/roadmap';
import CheckmarkIcon from './CheckmarkIcon';
import { NodeItemData, NodeStatus } from '@/types/roadmap';

type Props = {
  data: NodeItemData;
};

const Topic = ({ data }: Props) => {
  return (
    <div
      style={
        {
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: '#ffe599',
          padding: '5px 10px',
          border: '2px solid black',
          borderRadius: '5px',
          width: TOPIC.WIDTH,
          height: TOPIC.HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '--hover-color': '#f3c950',
        } as React.CSSProperties
      }
    >
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: '50%',
          ...(data?.dir === 'R'
            ? { left: '0%', transform: 'translate(-50%, -50%)' }
            : { right: '0%', transform: 'translate(50%, -50%)' }),
        }}
      >
        <CheckmarkIcon
          completed={data?.isCompleted ?? false}
          status={data?.status ?? NodeStatus.NotStarted}
        />
      </button>

      <div style={{ fontSize: '0.65rem', fontWeight: 600 }}>{data.label}</div>

      {/* Define handles */}
      {data?.dir === 'R' ? (
        <>
          <Handle
            type="target"
            position={Position.Right}
            id="right"
            style={{ background: 'transparent', border: 'none' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="left"
            style={{ background: 'transparent', border: 'none' }}
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            style={{ background: 'transparent', border: 'none' }}
          />
          <Handle
            type="source"
            position={Position.Left}
            id="right"
            style={{ background: 'transparent', border: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default Topic;
