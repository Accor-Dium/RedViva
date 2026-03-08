import { useState, useEffect, useCallback, useMemo } from "react";
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
    getEscuelasDetalle,
    getLocalidades,
    postEscuela,
    type EscuelaRow,
} from "../../../services/catalogos.services.ts";
import type { FilterOption } from "../../../constants/components/denuncias.ts";

const { ESCUELAS } = CATALOGOS_PAGE;

const styles = {
    wrapper: "flex flex-col gap-6",
    form: {
        card: "rounded-xl border border-gray-200 bg-white p-6",
        title: "text-lg font-semibold text-gray-900 mb-4",
        row: "flex flex-wrap items-end gap-4",
        field: "flex flex-col gap-1.5 flex-1 min-w-[200px]",
        label: "text-sm font-medium text-gray-700",
        input: "rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors",
        select: "rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors bg-white cursor-pointer",
        submit: "rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 transition-colors cursor-pointer h-fit",
    },
    combo: {
        wrapper: "relative",
        input: "w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors",
        dropdown: "absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-lg",
        option: "px-4 py-2 text-sm text-gray-900 hover:bg-purple-50 cursor-pointer",
        optionActive: "px-4 py-2 text-sm text-white bg-purple-600 cursor-pointer",
        empty: "px-4 py-2 text-sm text-gray-400",
        clear: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer",
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

/** Combobox con búsqueda — mismo patrón que FilterBar */
function SearchableSelect({
                              options,
                              value,
                              onChange,
                              placeholder,
                          }: {
    options: FilterOption[];
    value: number | undefined;
    onChange: (id: number | undefined) => void;
    placeholder: string;
}) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = useMemo(
        () => options.find((o) => o.id === value),
        [options, value]
    );

    const filtered = useMemo(() => {
        if (!query.trim()) return options;
        const lower = query.toLowerCase();
        return options.filter((o) => o.nombre.toLowerCase().includes(lower));
    }, [options, query]);

    const handleSelect = (option: FilterOption) => {
        onChange(option.id);
        setQuery("");
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange(undefined);
        setQuery("");
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        if (e.target.value === "") {
            onChange(undefined);
        }
    };

    return (
        <div
            className={styles.combo.wrapper}
            onBlur={(e) => {
                const relatedTarget = e.relatedTarget;
                if (
                    !relatedTarget ||
                    !(relatedTarget instanceof Node) ||
                    !e.currentTarget.contains(relatedTarget)
                ) {
                    setIsOpen(false);
                    setQuery("");
                }
            }}
        >
            <input
                type="text"
                className={styles.combo.input}
                placeholder={placeholder}
                value={isOpen ? query : selectedOption?.nombre ?? ""}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
            />
            {value && (
                <button
                    type="button"
                    className={styles.combo.clear}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleClear();
                    }}
                >
                    ✕
                </button>
            )}
            {isOpen && (
                <ul className={styles.combo.dropdown}>
                    {filtered.length === 0 ? (
                        <li className={styles.combo.empty}>Sin resultados</li>
                    ) : (
                        filtered.map((option) => (
                            <li
                                key={option.id}
                                className={
                                    option.id === value
                                        ? styles.combo.optionActive
                                        : styles.combo.option
                                }
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(option);
                                }}
                            >
                                {option.nombre}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function EscuelasSection() {
    const [escuelas, setEscuelas] = useState<EscuelaRow[]>([]);
    const [localidades, setLocalidades] = useState<FilterOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [nombre, setNombre] = useState("");
    const [grado, setGrado] = useState("");
    const [localidadId, setLocalidadId] = useState<number | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [escuelasData, localidadesData] = await Promise.all([
                getEscuelasDetalle(),
                getLocalidades(),
            ]);
            setEscuelas(escuelasData);
            setLocalidades(localidadesData);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetForm = () => {
        setNombre("");
        setGrado("");
        setLocalidadId(undefined);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !grado.trim() || !localidadId) return;

        setIsSubmitting(true);
        setMessage(null);
        try {
            await postEscuela({
                nombre: nombre.trim(),
                grado: grado.trim(),
                localidadId: Number(localidadId),
            });
            resetForm();
            setMessage({ type: "success", text: ESCUELAS.SUCCESS_MESSAGE });
            await fetchData();
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Error al crear la escuela";
            setMessage({ type: "error", text: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const isFormValid = nombre.trim() && grado.trim() && localidadId;

    return (
        <div className={styles.wrapper}>
            {/* Formulario */}
            <div className={styles.form.card}>
                <h2 className={styles.form.title}>{ESCUELAS.FORM_TITLE}</h2>

                {message && (
                    <div className={`${message.type === "success" ? styles.toast.success : styles.toast.error} mb-4`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.form.row}>
                        <div className={styles.form.field}>
                            <label className={styles.form.label}>{ESCUELAS.FIELD_NOMBRE}</label>
                            <input
                                type="text"
                                className={styles.form.input}
                                placeholder={ESCUELAS.PLACEHOLDER_NOMBRE}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.form.field}>
                            <label className={styles.form.label}>{ESCUELAS.FIELD_GRADO}</label>
                            <select
                                className={styles.form.select}
                                value={grado}
                                onChange={(e) => setGrado(e.target.value)}
                                required
                            >
                                <option value="">{ESCUELAS.PLACEHOLDER_GRADO}</option>
                                {ESCUELAS.GRADOS.map((g) => (
                                    <option key={g} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.form.field}>
                            <label className={styles.form.label}>{ESCUELAS.FIELD_LOCALIDAD}</label>
                            <SearchableSelect
                                options={localidades}
                                value={localidadId}
                                onChange={(id) => setLocalidadId(id)}
                                placeholder={ESCUELAS.PLACEHOLDER_LOCALIDAD}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isFormValid}
                            className={styles.form.submit}
                        >
                            {isSubmitting ? ESCUELAS.SUBMITTING_BUTTON : ESCUELAS.SUBMIT_BUTTON}
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
                                <TableHead className={styles.header.cell}>{ESCUELAS.TABLE_HEADERS.ID}</TableHead>
                                <TableHead className={styles.header.cell}>{ESCUELAS.TABLE_HEADERS.NOMBRE}</TableHead>
                                <TableHead className={styles.header.cell}>{ESCUELAS.TABLE_HEADERS.GRADO}</TableHead>
                                <TableHead className={styles.header.cell}>{ESCUELAS.TABLE_HEADERS.LOCALIDAD}</TableHead>
                                <TableHead className={styles.header.cell}>{ESCUELAS.TABLE_HEADERS.FECHA}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {escuelas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className={styles.body.empty}>
                                        {ESCUELAS.EMPTY_STATE}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                escuelas.map((esc) => (
                                    <TableRow key={esc.id}>
                                        <TableCell className={styles.body.cell}>{esc.id}</TableCell>
                                        <TableCell>{esc.nombre}</TableCell>
                                        <TableCell>{esc.grado}</TableCell>
                                        <TableCell>{esc.localidad.nombre}</TableCell>
                                        <TableCell>{formatDate(esc.fecha_creacion)}</TableCell>
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