import { apiFetch } from "./api";
import type { FilterOption } from "../constants/components/denuncias.ts";
import { TURNOS } from "../constants/pages/contacto.ts";

/**
 * Obtener todas las instituciones educativas
 */
export async function getEscuelas(): Promise<FilterOption[]> {
    const res = await apiFetch<FilterOption[]>("/api/instituciones");
    return res.data;
}

/**
 * Obtener todas las localidades
 */
export async function getLocalidades(): Promise<FilterOption[]> {
    const res = await apiFetch<FilterOption[]>("/api/localidades");
    return res.data;
}

/**
 * Obtener los turnos de las escuelas
 */
export async function getTurnos() {
    return TURNOS
}