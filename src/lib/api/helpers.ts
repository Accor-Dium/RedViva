import type { ApiResponse } from "./types";

function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Crea una respuesta JSON estandarizada
 */
export function jsonResponse<T>(data: ApiResponse<T>, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

/**
 * Respuesta exitosa
 */
export function successResponse<T>(data: T, message: string = "Operacion exitosa", status: number = 200): Response {
    return jsonResponse({ success: true, data, message, timestamp: getCurrentTimestamp()}, status);
}

/**
 * Respuesta de error
 */
export function errorResponse(message: string, status: number = 500): Response {
    return jsonResponse({ success: false, error: message, timestamp: getCurrentTimestamp()}, status);
}

/**
 * Parsea y valida un ID numérico desde los params de la ruta
 */
export function parseId(id: string | undefined): number | null {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}