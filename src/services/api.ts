/** Respuesta genérica del API */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message: string;
    timestamp: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Fetch genérico con tipado.
 * Centraliza el manejo de errores de red y parseo de JSON.
 */
export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<ApiSuccessResponse<T>> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    const json: ApiResponse<T> = await res.json();

    if (!json.success) {
        throw new Error((json as ApiErrorResponse).error || "Error desconocido");
    }

    return json as ApiSuccessResponse<T>;
}