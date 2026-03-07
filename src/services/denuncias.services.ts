import { apiFetch } from "./api";
import type { DenunciaRow, DenunciasPaginatedResponse, DenunciasFilters } from "../constants/components/denuncias.ts";

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

    return params.toString();
}

/**
 * Obtener denuncias paginadas con filtros
 */
export async function getDenuncias(
    page: number,
    limit: number,
    filters: DenunciasFilters = {}
): Promise<DenunciasPaginatedResponse> {
    const query = buildParams(page, limit, filters);
    const res = await fetch(`${BASE_URL}?${query}`);
    const json: DenunciasPaginatedResponse = await res.json();
    return json;
}

/**
 * Eliminar una denuncia por ID
 */
export async function deleteDenuncia(id: number): Promise<void> {
    await apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}