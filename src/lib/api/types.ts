import type { APIContext } from "astro";

// Respuesta estándar de la API
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedData<T> {
    items: T[];
    pagination: PaginationMeta;
}


// Tipo para los handlers de Astro API routes
export type ApiHandler = (context: APIContext) => Promise<Response>;

// Tipo para errores de la API
export interface ApiError {
    status: number;
    message: string;
    timestamp: string;
}