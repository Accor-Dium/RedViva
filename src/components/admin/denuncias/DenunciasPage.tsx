import { useState, useEffect, useCallback } from "react";
import FilterBar from "./FilterBar.tsx";
import DenunciasTable from "./DenunciasTable.tsx";
import DeleteModal from "./DeleteModal.tsx";
import { DENUNCIAS_PAGE } from "../../../constants/components/denuncias.ts";
import type {
    DenunciaRow,
    DenunciasFilters,
    FilterOption,
} from "../../../constants/components/denuncias.ts";
import { FileXls } from "@phosphor-icons/react";

import { getDenuncias, deleteDenuncia } from "../../../services/denuncias.services.ts";
import { getEscuelas, getLocalidades } from "../../../services/catalogos.service.ts";

const styles = {
    container: "flex flex-col gap-6 w-full",
    title: "text-3xl font-bold text-gray-900",
    loader: {
        wrapper: "flex items-center justify-center py-12",
        spinner: "h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent",
    },
    export: {
        wrapper: "flex justify-end",
        button: "flex items-center gap-2 rounded-full bg-purple-500 px-6 py-2 text-sm font-medium text-white hover:bg-purple-600 transition-colors cursor-pointer",
    },
} as const;

export default function DenunciasPage() {
    const [denuncias, setDenuncias] = useState<DenunciaRow[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<DenunciasFilters>({});
    const [isLoading, setIsLoading] = useState(true);

    const [escuelas, setEscuelas] = useState<FilterOption[]>([]);
    const [localidades, setLocalidades] = useState<FilterOption[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const fetchDenuncias = useCallback(
        async (pageNum: number) => {
            setIsLoading(true);
            try {
                const json = await getDenuncias(pageNum, DENUNCIAS_PAGE.ITEMS_PER_PAGE, filters);

                if (json.success) {
                    setDenuncias(json.data);
                    setTotalPages(json.pagination.totalPages);
                    setPage(json.pagination.page);
                }
            } catch (error) {
                console.error("Error al cargar denuncias:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [filters]
    );

    const fetchCatalogos = async () => {
        try {
            const [escuelasData, localidadesData] = await Promise.all([
                getEscuelas(),
                getLocalidades(),
            ]);
            setEscuelas(escuelasData);
            setLocalidades(localidadesData);
        } catch (error) {
            console.error("Error al cargar catálogos:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteDenuncia(id);
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            const newPage = denuncias.length === 1 && page > 1 ? page - 1 : page;
            await fetchDenuncias(newPage);
        } catch (error) {
            console.error("Error al eliminar denuncia:", error);
        }
    };

    const openDeleteModal = (id: number) => {
        setDeleteTargetId(id);
        setDeleteModalOpen(true);
    };

    const handleFilterChange = (newFilters: DenunciasFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    useEffect(() => {
        fetchCatalogos();
    }, []);

    useEffect(() => {
        fetchDenuncias(page);
    }, [page, fetchDenuncias]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{DENUNCIAS_PAGE.TITLE}</h1>

            <FilterBar
                escuelas={escuelas}
                localidades={localidades}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {isLoading ? (
                <div className={styles.loader.wrapper}>
                    <div className={styles.loader.spinner} />
                </div>
            ) : (
                <DenunciasTable
                    denuncias={denuncias}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onDelete={openDeleteModal}
                />
            )}

            <div className={styles.export.wrapper}>
                <button className={styles.export.button}>
                    <FileXls size={18} />
                    {DENUNCIAS_PAGE.EXPORT_BUTTON}
                </button>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                denunciaId={deleteTargetId}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteTargetId(null);
                }}
                onConfirm={handleDelete}
            />
        </div>
    );
}