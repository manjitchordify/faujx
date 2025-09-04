import { Handle, Position } from '@xyflow/react';
import { ASSIGNMENT } from '@/constants/roadmap';
import CheckmarkIcon from './CheckmarkIcon';
import { NodeItemData, NodeStatus } from '@/types/roadmap';

type Props = {
  data: NodeItemData;
};

const Assignment = ({ data }: Props) => {
  return (
    <div
      style={
        {
          position: 'relative',
          cursor: 'pointer',
          backgroundColor: '#fff',
          padding: '5px 10px',
          border: '2px solid black',
          borderRadius: '5px',
          width: ASSIGNMENT.WIDTH,
          height: ASSIGNMENT.HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '--hover-color': '#ebebeb',
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
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            style={{ background: 'transparent', border: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default Assignment;
