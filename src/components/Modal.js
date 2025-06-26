import React from 'react';

const Modal = ({ children, onClose }) => {
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />
      
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-lg p-6 relative w-full max-w-lg mx-4 z-10"
        onClick={handleModalClick}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 