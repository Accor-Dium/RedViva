// PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/denuncias/METODO

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// crear denuncia
export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { escuelaId, turno, descripcion} = body;

        // validaciones
        if (!escuelaId || typeof escuelaId !== "number" || escuelaId <= 0) {
            return errorResponse("El campo 'escuelaId' es requerido y debe ser un número válido", 400);
        }

        if (!turno || typeof turno !== "string" || turno.trim().length === 0) {
            return errorResponse("El campo 'turno' es requerido", 400);
        }

        if (!descripcion || typeof descripcion !== "string" || descripcion.trim().length === 0) {
            return errorResponse("El campo 'descripcion' es requerido y debe ser un texto válido", 400);
        }

        const escuela = await prisma.inst_educativa.findUnique({
            where: { id: escuelaId },
        });

        if (!escuela) {
            return errorResponse(`No existe una institución educativa con id ${escuelaId}`, 404);
        }

        const denuncia = await prisma.denuncia.create({
            data: {
                escuelaId,
                turno,
                descripcion: descripcion.trim(),
            },
            include: { escuela: true },
        });

        return successResponse(denuncia, "Denuncia creada correctamente", 201);
    } catch (error) {
        return errorResponse("Error al crear la denuncia");
    }
}