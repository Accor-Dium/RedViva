import { useState } from "react";
import { DENUNCIAS_PAGE } from "../../../constants/components/denuncias.ts";

const { DELETE_MODAL } = DENUNCIAS_PAGE;

interface DeleteModalProps {
    isOpen: boolean;
    denunciaId: number | null;
    onClose: () => void;
    onConfirm: (id: number) => Promise<void>;
}

const styles = {
    backdrop: "fixed inset-0 z-50 flex items-center justify-center",
    overlay: "fixed inset-0 bg-black/50",
    modal: "relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl",
    title: "text-lg font-bold text-gray-900",
    description: "mt-2 text-sm text-gray-600",
    actions: "mt-6 flex justify-end gap-3",
    cancelButton: "rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer",
    confirmButton: "rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer",
} as const;

export default function DeleteModal({ isOpen, denunciaId, onClose, onConfirm }: DeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !denunciaId) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(denunciaId);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.overlay} onClick={onClose} />

            <div className={styles.modal}>
                <h2 className={styles.title}>
                    {DELETE_MODAL.TITLE}
                </h2>
                <p className={styles.description}>
                    {DELETE_MODAL.DESCRIPTION}
                </p>

                <div className={styles.actions}>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className={styles.cancelButton}
                    >
                        {DELETE_MODAL.CANCEL}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className={styles.confirmButton}
                    >
                        {isDeleting ? DELETE_MODAL.DELETING : DELETE_MODAL.CONFIRM}
                    </button>
                </div>
            </div>
        </div>
    );
}