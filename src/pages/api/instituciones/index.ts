//PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/instituciones/

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";


// crear institución educativa
export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { nombre, grado, localidadId } = body;

        // validaciones
        if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
            return errorResponse("El campo 'nombre' es requerido y debe ser un texto válido", 400);
        }

        if (!grado || typeof grado !== "string" || grado.trim().length === 0) {
            return errorResponse("El campo 'grado' es requerido y debe ser un texto válido", 400);
        }

        if (!localidadId || typeof localidadId !== "number" || localidadId <= 0) {
            return errorResponse("El campo 'localidadId' es requerido y debe ser un número válido", 400);
        }

        // localidad unica
        const localidad = await prisma.localidad.findUnique({
            where: { id: localidadId },
        });

        if (!localidad) {
            return errorResponse(`No existe una localidad con id ${localidadId}`, 404);
        }

        const institucion = await prisma.inst_educativa.create({
            data: {
                nombre: nombre.trim(),
                grado: grado.trim(),
                localidadId,
            },
            include: { localidad: true },
        });

        return successResponse(institucion, "Institución educativa creada correctamente", 201);
    } catch (error) {
        return errorResponse("Error al crear la institución educativa");
    }
}

// todas las instituciones educativas
export async function GET(): Promise<Response> {
    try {
        const instituciones = await prisma.inst_educativa.findMany({
            include: { localidad: true },
            orderBy: { fecha_creacion: "desc" },
        });

        return successResponse(instituciones, "Instituciones educativas obtenidas correctamente");
    } catch (error) {
        return errorResponse("Error al obtener las instituciones educativas");
    }
}
