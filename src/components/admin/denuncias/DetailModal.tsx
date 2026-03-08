import { DENUNCIAS_PAGE } from "../../../constants/components/denuncias.ts";
import type { DenunciaRow } from "../../../constants/components/denuncias.ts";

const { DETAIL_MODAL } = DENUNCIAS_PAGE;

interface DetailModalProps {
    isOpen: boolean;
    denuncia: DenunciaRow | null;
    onClose: () => void;
}

const styles = {
    backdrop: "fixed inset-0 z-50 flex items-center justify-center",
    overlay: "fixed inset-0 bg-black/50",
    modal: "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto",
    header: "flex items-center justify-between mb-4",
    title: "text-lg font-bold text-gray-900",
    closeButton: "rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer",
    fields: "flex flex-col gap-4",
    field: {
        wrapper: "flex flex-col gap-1",
        label: "text-xs font-semibold text-purple-600 uppercase tracking-wide",
        value: "text-sm text-gray-800",
        description: "text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto",
    },
    row: "grid grid-cols-2 gap-4",
} as const;

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function DetailModal({ isOpen, denuncia, onClose }: DetailModalProps) {
    if (!isOpen || !denuncia) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.overlay} onClick={onClose} />

            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {DETAIL_MODAL.TITLE} #{denuncia.id}
                    </h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.fields}>
                    <div className={styles.row}>
                        <div className={styles.field.wrapper}>
                            <span className={styles.field.label}>{DETAIL_MODAL.ESCUELA}</span>
                            <span className={styles.field.value}>{denuncia.escuela.nombre}</span>
                        </div>
                        <div className={styles.field.wrapper}>
                            <span className={styles.field.label}>{DETAIL_MODAL.LOCALIDAD}</span>
                            <span className={styles.field.value}>{denuncia.escuela.localidad.nombre}</span>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field.wrapper}>
                            <span className={styles.field.label}>{DETAIL_MODAL.TURNO}</span>
                            <span className={styles.field.value}>{denuncia.turno}</span>
                        </div>
                        <div className={styles.field.wrapper}>
                            <span className={styles.field.label}>{DETAIL_MODAL.FECHA}</span>
                            <span className={styles.field.value}>{formatDate(denuncia.fecha_creacion)}</span>
                        </div>
                    </div>

                    <div className={styles.field.wrapper}>
                        <span className={styles.field.label}>{DETAIL_MODAL.DESCRIPCION}</span>
                        <div className={styles.field.description}>
                            {denuncia.descripcion}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}