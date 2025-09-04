import React, { FC } from 'react';
import { ClipLoader } from 'react-spinners';

interface LoaderProps {
  text: string;
}

const Loader: FC<LoaderProps> = ({ text = 'Loading' }) => {
  return (
    <div className="flex-1 flex justify-center items-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <ClipLoader
          color={'#1F514C'}
          loading={true}
          size={60}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
