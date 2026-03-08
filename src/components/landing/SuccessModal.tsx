import { createPortal } from "react-dom"
import { SUCCESS_MODAL } from "../../constants/pages/contacto"

interface SuccessModalProps {
    isOpen: boolean
    onAccept: () => void
}

const styles = {
    backdrop: "fixed inset-0 z-50 flex items-center justify-center",
    overlay:  "fixed inset-0 bg-black/50",
    modal:    "relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl",
    icon:     "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100",
    title:    "text-center text-lg font-bold text-gray-900",
    description: "mt-2 text-center text-sm text-gray-600",
    actions:  "mt-6 flex justify-center",
    button:   "rounded-md bg-red-400 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors cursor-pointer",
} as const

export function SuccessModal({ isOpen, onAccept }: SuccessModalProps) {
    if (!isOpen) return null

    return createPortal(
        <div className={styles.backdrop}>
            <div className={styles.overlay} />

            <div className={styles.modal}>
                <div className={styles.icon}>
                    <svg
                        className="h-7 w-7 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className={styles.title}>{SUCCESS_MODAL.TITLE}</h2>
                <p className={styles.description}>{SUCCESS_MODAL.DESCRIPTION}</p>

                <div className={styles.actions}>
                    <button onClick={onAccept} className={styles.button}>
                        {SUCCESS_MODAL.BUTTON}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
