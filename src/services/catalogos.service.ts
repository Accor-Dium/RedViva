import { apiFetch } from "./api";
import type { FilterOption } from "../constants/components/denuncias.ts";

/**
 * Obtener todas las instituciones educativas
 */
export async function getEscuelas(): Promise<FilterOption[]> {
    const res = await apiFetch<FilterOption[]>("/api/instituciones-educativas");
    return res.data;
}

/**
 * Obtener todas las localidades
 */
export async function getLocalidades(): Promise<FilterOption[]> {
    const res = await apiFetch<FilterOption[]>("/api/localidades");
    return res.data;
}