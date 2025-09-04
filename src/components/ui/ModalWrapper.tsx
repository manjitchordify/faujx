import React, { ReactNode } from 'react';

interface ModalWrapperProps {
  children: ReactNode;
  onClose: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
    >
      {children}
    </div>
  );
};

export default ModalWrapper;
