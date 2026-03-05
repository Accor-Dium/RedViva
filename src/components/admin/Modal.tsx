import React, { useState, useEffect } from 'react';

interface AgregarModalProps {
  children: React.ReactNode;
  buttonText?: string;
  buttonClassName?: string;
}

export default function Modal({ 
  children, 
  buttonText = "Modal",
  buttonClassName = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
}: AgregarModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={buttonClassName}>
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div onClick={handleClose} className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0' 
            }`}
          />

          <div 
            className={`relative bg-white rounded-lg shadow-xl max-w-md w-full h-fit mx-4 p-6 z-10 transition-all duration-300 ${
              isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            
            {children}

            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}