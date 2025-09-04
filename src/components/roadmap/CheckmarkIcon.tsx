import { NodeItemStatus } from '@/types/roadmap';

type Props = {
  completed: boolean;
  status: NodeItemStatus;
};

const CheckmarkIcon = ({ completed, status }: Props) => (
  <div
    style={{
      backgroundColor: completed
        ? '#4CAF50'
        : status === 'In Progress'
          ? '#ffca28'
          : '#ccc',
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill={completed || status === 'In Progress' ? '#fff' : '#000'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  </div>
);

export default CheckmarkIcon;
