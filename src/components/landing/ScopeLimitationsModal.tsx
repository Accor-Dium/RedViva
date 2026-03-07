import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { animate } from "motion/mini";

interface ScopeLimitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScopeLimitationsModal({ isOpen, onClose }: ScopeLimitationsModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      
      const modal = document.getElementById("scope-limitations-modal");
      const modalContent = modal?.firstElementChild;

      if (modal && modalContent) {
        animate(modal, { opacity: [0, 1] }, { duration: 0.25, ease: "easeOut" });
        animate(
          modalContent,
          { opacity: [0, 1], scale: [0.96, 1] },
          { duration: 0.3, ease: "easeOut" }
        );
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = async () => {
    if (isClosing) return;
    setIsClosing(true);

    const modal = document.getElementById("scope-limitations-modal");
    const modalContent = modal?.firstElementChild;

    if (modal && modalContent) {
      await Promise.all([
        animate(modal, { opacity: [1, 0] }, { duration: 0.2, ease: "easeIn" }).finished,
        animate(
          modalContent,
          { opacity: [1, 0], scale: [1, 0.98] },
          { duration: 0.2, ease: "easeIn" }
        ).finished,
      ]);
    }

    setIsClosing(false);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      id="scope-limitations-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scope-limitations-title"
    >
      <div className="w-full max-w-2xl rotate-3 bg-white p-10 shadow-2xl md:px-26 md:py-20">
        <div className="-rotate-3">
          <h2 id="scope-limitations-title" className="text-3xl font-bold text-black text-center pb-4">
            DECLARACIÓN DE ALCANCE Y LIMITACIONES
          </h2>
          <p className="mt-3 text-sm leading-tight text-gray-700 md:text-base text-justify">
            Este instituto recibe información de manera preventiva como parte de su
            labor de orientación dentro del ámbito escolar.
          </p>
          <p className="mt-3 text-sm leading-tight text-gray-700 md:text-base text-justify">
            Este reporte no constituye una denuncia formal ni sustituye los
            procedimientos legales correspondientes. En caso de requerirse una
            acción legal o denuncia formal, deberá presentarse directamente ante la
            autoridad competente.
          </p>
          <p className="mt-3 text-sm leading-tight text-gray-700 md:text-base text-justify">
            La institución actúa únicamente como canal de prevención y recepción de
            información, sin determinar responsabilidades ni emitir juicios sobre
            los hechos señalados.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleClose}
              className="rounded-md font-semibold cursor-pointer transition-colors bg-red-400 hover:bg-red-500 text-white text-sm px-7 py-3"
            >
              Entendido, continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
