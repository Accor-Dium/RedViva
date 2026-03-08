import type { DenunciasFilters } from "../../../constants/components/denuncias.ts";
import { Funnel } from "@phosphor-icons/react";
import { useState } from "react";
import DateRangePicker from "../../admin/denuncias/DateRangePicker.tsx";
interface StatsFilterBarProps {
    grados: string[];
    filters: DenunciasFilters;
    onFilterChange: (filters: DenunciasFilters) => void;
}

const styles = {
    container: "flex justify-end items-center",
    filters: {
        wrapper: "flex flex-wrap items-center gap-3",
        label: "flex items-center gap-1 text-sm font-medium text-gray-700",
        comboWrapper: "relative",
        comboInput: "rounded-full bg-purple-600 px-4 py-1.5 text-sm font-medium text-white cursor-pointer appearance-none outline-none placeholder-white/70 w-48",
        comboDropdown: "absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-lg",
        comboOption: "px-4 py-2 text-sm text-gray-900 hover:bg-purple-50 cursor-pointer",
        comboOptionActive: "px-4 py-2 text-sm text-white bg-purple-600 cursor-pointer",
        comboEmpty: "px-4 py-2 text-sm text-gray-400",
    },
} as const;

function GradoSelect({
    grados,
    value,
    onChange,
    placeholder,
}: {
    grados: string[];
    value: string | undefined;
    onChange: (grado: string | undefined) => void;
    placeholder: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (grado: string) => {
        onChange(grado);
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange(undefined);
        setIsOpen(false);
    };

    return (
        <div
            className={styles.filters.comboWrapper}
            onBlur={(e) => {
                const relatedTarget = e.relatedTarget;
                if (
                    !relatedTarget ||
                    !(relatedTarget instanceof Node) ||
                    !e.currentTarget.contains(relatedTarget)
                ) {
                    setIsOpen(false);
                }
            }}
        >
            <button
                type="button"
                className={styles.filters.comboInput}
                onClick={() => setIsOpen(!isOpen)}
            >
                {value || placeholder}
            </button>
            {value && (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleClear();
                    }}
                >
                    ✕
                </button>
            )}
            {isOpen && (
                <ul className={styles.filters.comboDropdown}>
                    {grados.length === 0 ? (
                        <li className={styles.filters.comboEmpty}>Sin grados disponibles</li>
                    ) : (
                        grados.map((grado) => (
                            <li
                                key={grado}
                                className={
                                    grado === value
                                        ? styles.filters.comboOptionActive
                                        : styles.filters.comboOption
                                }
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(grado);
                                }}
                            >
                                {grado}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default function StatsFilterBar({ grados, filters, onFilterChange }: StatsFilterBarProps) {
    const handleGradoChange = (grado: string | undefined) => {
        const newFilters = { ...filters };

        if (grado) {
            newFilters.grado = grado;
        } else {
            delete newFilters.grado;
        }

        onFilterChange(newFilters);
    };

    const handleDateRangeChange = (fechaDesde?: string, fechaHasta?: string) => {
        const newFilters = { ...filters };

        if (fechaDesde) {
            newFilters.fechaDesde = fechaDesde;
        } else {
            delete newFilters.fechaDesde;
        }

        if (fechaHasta) {
            newFilters.fechaHasta = fechaHasta;
        } else {
            delete newFilters.fechaHasta;
        }

        onFilterChange(newFilters);
    };

    return (
        <div className={styles.container}>
            <div className={styles.filters.wrapper}>
                <span className={styles.filters.label}>
                    <Funnel size={16} />
                    Filtros
                </span>

                <GradoSelect
                    grados={grados}
                    value={filters.grado}
                    onChange={handleGradoChange}
                    placeholder="Seleccionar grado"
                />

                <DateRangePicker
                    fechaDesde={filters.fechaDesde}
                    fechaHasta={filters.fechaHasta}
                    placeholder="Seleccionar fechas"
                    onChange={handleDateRangeChange}
                />
            </div>
        </div>
    );
}