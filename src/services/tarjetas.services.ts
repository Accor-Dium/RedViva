import { apiFetch } from "./api";
import type {
    TarjetasPaginatedData,
} from "../constants/components/tarjetas.ts";

const BASE_URL = "/api/tarjetas";

function buildParams(page: number, limit: number): string {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    return params.toString();
}

export async function getTarjetasPaginated(
    page: number,
    limit: number,
): Promise<TarjetasPaginatedData> {
    const query = buildParams(page, limit);
    const res = await apiFetch<TarjetasPaginatedData>(`${BASE_URL}?${query}`);
    return res.data;
}



interface CreateTarjetaData {
    descripcion: string;
    imagen: string;
    enlace: string;
}

interface CreateTarjetaResponse {
    success: boolean;
    data: any;
    message: string;
}


export async function createTarjeta(
    data: CreateTarjetaData
): Promise<CreateTarjetaResponse> {
    const res = await apiFetch<CreateTarjetaResponse>(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    
    return res.data;
}