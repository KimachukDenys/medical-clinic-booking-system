import React from 'react';
import './Modal.css'; // Можна додати базові стилі

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">✖</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
