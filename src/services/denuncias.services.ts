import { apiFetch } from "./api";
import type {
    DenunciasPaginatedData,
    DenunciasFilters,
} from "../constants/components/denuncias.ts";

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

/**
 * Obtener TODAS las denuncias filtradas (sin paginación, para exportar).
 */
export async function getAllDenuncias(
    filters: DenunciasFilters = {}
): Promise<DenunciasPaginatedData> {
    const params = new URLSearchParams({ page: "1", limit: "10000" });

    if (filters.escuelaId) params.set("escuelaId", String(filters.escuelaId));
    if (filters.localidadId) params.set("localidadId", String(filters.localidadId));
    if (filters.fechaDesde) params.set("fechaDesde", filters.fechaDesde);
    if (filters.fechaHasta) params.set("fechaHasta", filters.fechaHasta);

    const res = await apiFetch<DenunciasPaginatedData>(`${BASE_URL}?${params.toString()}`);
    return res.data;
}

/**
 * Eliminar una denuncia por ID
 */
export async function deleteDenuncia(id: number): Promise<void> {
    await apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}