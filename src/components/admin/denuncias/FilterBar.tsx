import { DENUNCIAS_PAGE } from "../../../constants/components/denuncias.ts";
import type { DenunciasFilters, FilterOption } from "../../../constants/components/denuncias.ts";
import { Funnel, Plus } from "@phosphor-icons/react";

interface FilterBarProps {
    escuelas: FilterOption[];
    localidades: FilterOption[];
    filters: DenunciasFilters;
    onFilterChange: (filters: DenunciasFilters) => void;
}

const styles = {
    container: "flex justify-end items-center",
    addButton: "flex items-center gap-1 rounded-full bg-purple-500 px-5 py-1.5 text-sm font-medium text-white hover:bg-purple-600 transition-colors cursor-pointer",
    filters: {
        wrapper: "flex flex-wrap items-center gap-3",
        label: "flex items-center gap-1 text-sm font-medium text-gray-700",
        select: "rounded-full bg-purple-600 px-4 py-1.5 text-sm font-medium text-white cursor-pointer appearance-none outline-none [&>option]:bg-white [&>option]:text-gray-900",
        dateInput: "rounded-full bg-purple-600 px-4 py-1.5 text-sm font-medium text-white cursor-pointer outline-none",
    },
} as const;

export default function FilterBar({ escuelas, localidades, filters, onFilterChange }: FilterBarProps) {

    const handleChange = (key: keyof DenunciasFilters, value: string) => {
        const newFilters = { ...filters };

        if (value === "") {
            delete newFilters[key];
        } else if (key === "escuelaId" || key === "localidadId") {
            newFilters[key] = Number(value);
        } else {
            newFilters[key] = value;
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

                <select
                    className={styles.filters.select}
                    value={filters.escuelaId ?? ""}
                    onChange={(e) => handleChange("escuelaId", e.target.value)}
                >
                    <option value="">{DENUNCIAS_PAGE.FILTER_ESCUELA}</option>
                    {escuelas.map((e) => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                </select>

                <select
                    className={styles.filters.select}
                    value={filters.localidadId ?? ""}
                    onChange={(e) => handleChange("localidadId", e.target.value)}
                >
                    <option value="">{DENUNCIAS_PAGE.FILTER_LOCALIDAD}</option>
                    {localidades.map((l) => (
                        <option key={l.id} value={l.id}>{l.nombre}</option>
                    ))}
                </select>

                <input
                    type="date"
                    className={styles.filters.dateInput}
                    value={filters.fechaDesde ?? ""}
                    onChange={(e) => handleChange("fechaDesde", e.target.value)}
                />
            </div>
        </div>
    );
}