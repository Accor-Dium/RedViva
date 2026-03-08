// PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/tarjetas-informativas/

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// Obtener todas las tarjetas informativas
export async function GET({ request }: APIContext): Promise<Response> {
    try {
        const url = new URL(request.url);
        const pageParam = url.searchParams.get("page");
        const limitParam = url.searchParams.get("limit");
        let page = pageParam ? parseInt(pageParam, 10) : 1;
        let limit = limitParam ? parseInt(limitParam, 10) : 10;
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }
        const MAX_LIMIT = 50;
        if (limit > MAX_LIMIT) {
            limit = MAX_LIMIT;
        }
        const skip = (page - 1) * limit;
        const tarjetas = await prisma.tarj_informativas.findMany({
            orderBy: { fecha_creacion: "desc" },
            skip,
            take: limit,
        });

        return successResponse(tarjetas, "Tarjetas informativas obtenidas correctamente");
    } catch (error) {
        return errorResponse("Error al obtener las tarjetas informativas");
    }
}

// Crear tarjeta informativa
export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { descripcion, imagen, enlace } = body;

        // Validaciones
        if (!descripcion || typeof descripcion !== "string" || descripcion.trim().length === 0) {
            return errorResponse("El campo 'descripcion' es requerido y debe ser un texto válido", 400);
        }

        if (!enlace || typeof enlace !== "string" || enlace.trim().length === 0) {
            return errorResponse("El campo 'enlace' es requerido y debe ser un texto válido", 400);
        }

        if (imagen && typeof imagen !== "string") {
            return errorResponse("El campo 'imagen' debe ser un texto (URL)", 400);
        }

        const tarjeta = await prisma.tarj_informativas.create({
            data: {
                descripcion: descripcion.trim(),
                imagen: imagen?.trim() || null,
                enlace: enlace.trim(),
            },
        });

        return successResponse(tarjeta, "Tarjeta informativa creada correctamente", 201);
    } catch (error) {
        return errorResponse("Error al crear la tarjeta informativa");
    }
}
