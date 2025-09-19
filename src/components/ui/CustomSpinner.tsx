import React, { FC } from 'react';
import { ClipLoader } from 'react-spinners';

interface CustomSpinnerProps {
  loaderSize: number;
}

const CustomSpinner: FC<CustomSpinnerProps> = ({ loaderSize = 40 }) => {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader
        color={'#1F514C'}
        loading={true}
        size={loaderSize}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default CustomSpinner;
