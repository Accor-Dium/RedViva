import { apiFetch } from "./api";
import type { FilterOption } from "../constants/components/denuncias.ts";
import { TURNOS } from "../constants/pages/contacto.ts";

/** Tipos completos para la vista de catálogos */
export interface LocalidadRow {
    id: number;
    nombre: string;
    fecha_creacion: string;
}

export interface EscuelaRow {
    id: number;
    nombre: string;
    grado: string;
    fecha_creacion: string;
    localidad: {
        id: number;
        nombre: string;
    };
}

/**
 * Obtener todas las instituciones educativas
 */
export async function getEscuelas(): Promise<FilterOption[]> {
    const res = await apiFetch<FilterOption[]>("/api/instituciones");
    return res.data;
}

/**
 * Obtener todas las instituciones educativas (con detalle completo)
 */
export async function getEscuelasDetalle(): Promise<EscuelaRow[]> {
    const res = await apiFetch<EscuelaRow[]>("/api/instituciones");
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
 * Obtener todas las localidades (con detalle completo)
 */
export async function getLocalidadesDetalle(): Promise<LocalidadRow[]> {
    const res = await apiFetch<LocalidadRow[]>("/api/localidades");
    return res.data;
}

/**
 * Crear una localidad
 */
export async function postLocalidad(nombre: string): Promise<void> {
    await apiFetch("/api/localidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
    });
}

/**
 * Crear una institución educativa
 */
export async function postEscuela(data: { nombre: string; grado: string; localidadId: number }): Promise<void> {
    await apiFetch("/api/instituciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

/**
 * Obtener los turnos de las escuelas
 */
export async function getTurnos() {
    return TURNOS;
}