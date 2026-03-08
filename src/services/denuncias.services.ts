import { apiFetch } from "./api";
import type {
    DenunciaRow,
    DenunciasPaginatedData,
    DenunciasFilters,
} from "../constants/components/denuncias.ts";
import type { DenunciaPayload } from "@/types/denuncias/interfaces.ts";

const BASE_URL = "/api/denuncias";

/**
 * Construye los query params de paginación + filtros
 */
function buildParams(page: number, limit: number, filters: DenunciasFilters): string {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (filters.escuelaId) params.set("escuelaId", String(filters.escuelaId));
    if (filters.localidadId) params.set("localidadId", String(filters.localidadId));
    if (filters.fechaDesde) params.set("fechaDesde", filters.fechaDesde);
    if (filters.fechaHasta) params.set("fechaHasta", filters.fechaHasta);

    return params.toString();
}

export async function getDenuncias(
    page: number,
    limit: number,
    filters: DenunciasFilters = {}
): Promise<DenunciasPaginatedData> {
    const query = buildParams(page, limit, filters);
    const res = await apiFetch<DenunciasPaginatedData>(`${BASE_URL}?${query}`);
    return res.data;
}

const MAX_BACKEND_LIMIT = 50;

export async function getAllDenuncias(
    filters: DenunciasFilters = {}
): Promise<DenunciaRow[]> {
    const firstPage = await getDenuncias(1, MAX_BACKEND_LIMIT, filters);
    const allItems: DenunciaRow[] = [...firstPage.items];
    const { totalPages } = firstPage.pagination;

    if (totalPages > 1) {
        const remainingPages = Array.from(
            { length: totalPages - 1 },
            (_, i) => i + 2
        );

        const results = await Promise.all(
            remainingPages.map((page) =>
                getDenuncias(page, MAX_BACKEND_LIMIT, filters)
            )
        );

        for (const result of results) {
            allItems.push(...result.items);
        }
    }

    return allItems;
}

/**
 * Eliminar una denuncia por ID
 */
export async function deleteDenuncia(id: number): Promise<void> {
    await apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}

/**
 * Crea una denuncia
 */
export async function postDenuncia(data: DenunciaPayload): Promise<void> {
    await apiFetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}