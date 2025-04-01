// components/legal/LegalModal.js
import { useEffect } from 'react';

const LegalModal = ({ title, children, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = '';
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2>{title}</h2>
        <div className="legal-scroll-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;  // Add this line to export the component
