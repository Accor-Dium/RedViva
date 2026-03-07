import { apiFetch } from "./api";
import type {
    DenunciaRow,
    DenunciasPaginatedResponse,
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

/**
 * Obtener denuncias paginadas con filtros.
 * Usa apiFetch para validar Content-Type, parseo y errores.
 */
export async function getDenuncias(
    page: number,
    limit: number,
    filters: DenunciasFilters = {}
): Promise<DenunciasPaginatedResponse> {
    const query = buildParams(page, limit, filters);
    const data = await apiFetch<DenunciasPaginatedResponse>(`${BASE_URL}?${query}`);
    return data as unknown as DenunciasPaginatedResponse;
}

/**
 * Eliminar una denuncia por ID
 */
export async function deleteDenuncia(id: number): Promise<void> {
    await apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}