// PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/tarjetas-informativas/

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// Obtener todas las tarjetas informativas
export async function GET(): Promise<Response> {
    try {
        const tarjetas = await prisma.tarj_informativas.findMany({
            orderBy: { fecha_creacion: "desc" },
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
