//PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/localidades/

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// crear localidad
export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { nombre } = body;

        if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
            return errorResponse("El campo 'nombre' es requerido y debe ser un texto válido", 400);
        }

        const localidad = await prisma.localidad.create({
            data: { nombre: nombre.trim() },
        });

        return successResponse(localidad, "Localidad creada correctamente", 201);
    } catch (error) {
        return errorResponse("Error al crear la localidad");
    }
}

// todas las localidades
export async function GET(): Promise<Response> {
    try {
        const localidades = await prisma.localidad.findMany({
            orderBy: { fecha_creacion: "desc" },
        });

        return successResponse(localidades, "Localidades obtenidas correctamente");
    } catch (error) {
        return errorResponse("Error al obtener las localidades");
    }
}

