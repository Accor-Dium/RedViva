import { apiFetch } from "./api";
import type { TarjetaInformativa } from "../types/directorio/InterfaceTarjInformativas";

const BASE_URL = "/api/tarjetas-informativas";

/**
 * Obtener todas las tarjetas informativas
 */
export async function getTarjetasInformativas(): Promise<TarjetaInformativa[]> {
    const res = await apiFetch<TarjetaInformativa[]>(BASE_URL);
    return res.data;
}

/**
 * Crear una tarjeta informativa
 */
export async function createTarjetaInformativa(
    data: Pick<TarjetaInformativa, "descripcion" | "imagen" | "enlace">
): Promise<TarjetaInformativa> {
    const res = await apiFetch<TarjetaInformativa>(BASE_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.data;
}
