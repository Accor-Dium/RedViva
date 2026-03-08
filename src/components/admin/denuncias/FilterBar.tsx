import { DENUNCIAS_PAGE } from "../../../constants/components/denuncias.ts";
import type { DenunciasFilters, FilterOption } from "../../../constants/components/denuncias.ts";
import { Funnel } from "@phosphor-icons/react";
import { useState, useMemo } from "react";

interface FilterBarProps {
    escuelas: FilterOption[];
    localidades: FilterOption[];
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
        dateInput: "rounded-full bg-purple-600 px-4 py-1.5 text-sm font-medium text-white cursor-pointer outline-none",
    },
} as const;

/** Combobox con búsqueda para manejar catálogos grandes */
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
        // Si borra todo el texto, limpiar el filtro
        if (e.target.value === "") {
            onChange(undefined);
        }
    };

    return (
        <div
            className={styles.filters.comboWrapper}
            onBlur={(e) => {
                // Cerrar solo si el foco sale del contenedor completo
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsOpen(false);
                    setQuery("");
                }
            }}
        >
            <input
                type="text"
                className={styles.filters.comboInput}
                placeholder={placeholder}
                value={isOpen ? query : selectedOption?.nombre ?? ""}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
            />
            {/* Botón para limpiar selección */}
            {value && (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs"
                    onMouseDown={(e) => {
                        e.preventDefault(); // Evita que el blur cierre antes del click
                        handleClear();
                    }}
                >
                    ✕
                </button>
            )}
            {isOpen && (
                <ul className={styles.filters.comboDropdown}>
                    {filtered.length === 0 ? (
                        <li className={styles.filters.comboEmpty}>Sin resultados</li>
                    ) : (
                        filtered.map((option) => (
                            <li
                                key={option.id}
                                className={
                                    option.id === value
                                        ? styles.filters.comboOptionActive
                                        : styles.filters.comboOption
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

export default function FilterBar({ escuelas, localidades, filters, onFilterChange }: FilterBarProps) {

    /** Al seleccionar escuela → limpiar localidad (y viceversa) */
    const handleEscuelaChange = (id: number | undefined) => {
        const newFilters = { ...filters };
        delete newFilters.localidadId; // Excluyente: limpiar localidad

        if (id) {
            newFilters.escuelaId = id;
        } else {
            delete newFilters.escuelaId;
        }

        onFilterChange(newFilters);
    };

    const handleLocalidadChange = (id: number | undefined) => {
        const newFilters = { ...filters };
        delete newFilters.escuelaId; // Excluyente: limpiar escuela

        if (id) {
            newFilters.localidadId = id;
        } else {
            delete newFilters.localidadId;
        }

        onFilterChange(newFilters);
    };

    const handleFechaChange = (value: string) => {
        const newFilters = { ...filters };

        if (value === "") {
            delete newFilters.fechaDesde;
        } else {
            newFilters.fechaDesde = value;
        }

        onFilterChange(newFilters);
    };

    return (
        <div className={styles.container}>
            <div className={styles.filters.wrapper}>
                <span className={styles.filters.label}>
                    <Funnel size={16} />
                    {DENUNCIAS_PAGE.FILTER_LABEL}
                </span>

                {/* Escuela — searchable para catálogos grandes */}
                <SearchableSelect
                    options={escuelas}
                    value={filters.escuelaId}
                    onChange={handleEscuelaChange}
                    placeholder={DENUNCIAS_PAGE.FILTER_ESCUELA}
                />

                {/* Localidad — searchable para catálogos grandes */}
                <SearchableSelect
                    options={localidades}
                    value={filters.localidadId}
                    onChange={handleLocalidadChange}
                    placeholder={DENUNCIAS_PAGE.FILTER_LOCALIDAD}
                />

                {/* Fecha */}
                <input
                    type="date"
                    className={styles.filters.dateInput}
                    value={filters.fechaDesde ?? ""}
                    onChange={(e) => handleFechaChange(e.target.value)}
                />
            </div>
        </div>
    );
}