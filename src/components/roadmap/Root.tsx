import { Handle, Position } from '@xyflow/react';
import { MODULE } from '@/constants/roadmap';
import { NodeItemData } from '@/types/roadmap';

type Props = {
  data: NodeItemData;
};

const Root = ({ data }: Props) => {
  return (
    <div
      style={{
        cursor: 'pointer',
        border: 'none',
        ...(data?.label && { width: MODULE.WIDTH, height: MODULE.HEIGHT }),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {data?.label && (
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{data.label}</div>
      )}

      {/* Define handles */}
      {data?.label && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={{ background: 'transparent', border: 'none' }}
        />
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: 'transparent', border: 'none' }}
      />
    </div>
  );
};

export default Root;
