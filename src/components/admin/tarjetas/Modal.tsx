import { XIcon } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  children,
  buttonText = "Modal",
  buttonClassName = "flex flex-row items-center justify-center gap-2 rounded-md font-semibold cursor-pointer transition-colors bg-pink-300 hover:bg-pink-400 text-pink-900 text-sm px-5 py-2 ",
  icon = null,
  modalWidth = "max-w-md"
}: ModalProps & { modalWidth?: string }) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const STYLES = {
    overlay: "fixed inset-0 z-9999 flex items-center justify-center",
    backdrop: `absolute inset-0 bg-black/50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`,
    modal: `relative bg-white rounded-lg shadow-xl ${modalWidth} w-full h-fit mx-4 p-6 z-10000 transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`,
    closeButton: "absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
  };

  const modalContent = isOpen ? (
    <div className={STYLES.overlay}>
      <div onClick={handleClose} className={STYLES.backdrop}/>

      <div className={STYLES.modal}>
        {typeof children === 'function' ? children(handleClose) : children}

        <button onClick={handleClose} className={STYLES.closeButton}>
          <XIcon size={20} />
        </button>

      </div>
    </div>
  ) : null;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={buttonClassName}>
        {icon}
        {buttonText}
      </button>

      {typeof window !== 'undefined' && createPortal(
        modalContent,
        document.body
      )}
    </>
  );
}