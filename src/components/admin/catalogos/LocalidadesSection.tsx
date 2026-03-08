import { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { CATALOGOS_PAGE } from "../../../constants/components/catalogos.ts";
import {
    getLocalidadesDetalle,
    postLocalidad,
    type LocalidadRow,
} from "../../../services/catalogos.services.ts";

const { LOCALIDADES } = CATALOGOS_PAGE;

const styles = {
    wrapper: "flex flex-col gap-6",
    form: {
        card: "rounded-xl border border-gray-200 bg-white p-6",
        title: "text-lg font-semibold text-gray-900 mb-4",
        row: "flex flex-wrap items-end gap-4",
        field: "flex flex-col gap-1.5 flex-1 min-w-[240px]",
        label: "text-sm font-medium text-gray-700",
        input: "rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors",
        submit: "rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition-colors cursor-pointer h-fit",
    },
    tableWrapper: "rounded-xl border border-gray-200 overflow-hidden",
    header: {
        row: "bg-purple-700 hover:bg-purple-700",
        cell: "text-white font-semibold",
    },
    body: {
        empty: "text-center py-8 text-gray-500",
        cell: "font-medium",
    },
    loader: {
        wrapper: "flex items-center justify-center py-12",
        spinner: "h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent",
    },
    toast: {
        success: "rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm",
        error: "rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm",
    },
} as const;

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function LocalidadesSection() {
    const [localidades, setLocalidades] = useState<LocalidadRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nombre, setNombre] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchLocalidades = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getLocalidadesDetalle();
            setLocalidades(data);
        } catch (error) {
            console.error("Error al cargar localidades:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        setIsSubmitting(true);
        setMessage(null);
        try {
            await postLocalidad(nombre.trim());
            setNombre("");
            setMessage({ type: "success", text: LOCALIDADES.SUCCESS_MESSAGE });
            await fetchLocalidades();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Error al crear la localidad";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchLocalidades();
    }, [fetchLocalidades]);

    return (
        <div className={styles.wrapper}>
            {/* Formulario */}
            <div className={styles.form.card}>
                <h2 className={styles.form.title}>{LOCALIDADES.FORM_TITLE}</h2>

                {message && (
                    <div className={`${message.type === "success" ? styles.toast.success : styles.toast.error} mb-4`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.form.row}>
                        <div className={styles.form.field}>
                            <label className={styles.form.label}>{LOCALIDADES.FIELD_NOMBRE}</label>
                            <input
                                type="text"
                                className={styles.form.input}
                                placeholder={LOCALIDADES.PLACEHOLDER_NOMBRE}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !nombre.trim()}
                            className={styles.form.submit}
                        >
                            {isSubmitting ? LOCALIDADES.SUBMITTING_BUTTON : LOCALIDADES.SUBMIT_BUTTON}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabla */}
            {isLoading ? (
                <div className={styles.loader.wrapper}>
                    <div className={styles.loader.spinner} />
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <Table>
                        <TableHeader>
                            <TableRow className={styles.header.row}>
                                <TableHead className={styles.header.cell}>{LOCALIDADES.TABLE_HEADERS.ID}</TableHead>
                                <TableHead className={styles.header.cell}>{LOCALIDADES.TABLE_HEADERS.NOMBRE}</TableHead>
                                <TableHead className={styles.header.cell}>{LOCALIDADES.TABLE_HEADERS.FECHA}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {localidades.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className={styles.body.empty}>
                                        {LOCALIDADES.EMPTY_STATE}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                localidades.map((loc) => (
                                    <TableRow key={loc.id}>
                                        <TableCell className={styles.body.cell}>{loc.id}</TableCell>
                                        <TableCell>{loc.nombre}</TableCell>
                                        <TableCell>{formatDate(loc.fecha_creacion)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}