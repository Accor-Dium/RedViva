/** Respuesta exitosa del API */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message: string;
    timestamp: string;
}

/** Respuesta de error del API */
export interface ApiErrorResponse {
    success: false;
    error: string;
    timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<ApiSuccessResponse<T>> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    const contentType = res.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
            `Respuesta no JSON del servidor (status ${res.status} ${res.statusText || ""}).`
        );
    }

    let json: ApiResponse<T>;
    try {
        json = (await res.json()) as ApiResponse<T>;
    } catch {
        throw new Error(
            `No se pudo parsear la respuesta JSON del servidor (status ${res.status} ${res.statusText || ""}).`
        );
    }

    if (!json.success) {
        throw new Error((json as ApiErrorResponse).error || `Error del servidor (status ${res.status})`);
    }

    return json as ApiSuccessResponse<T>;
}