// PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/denuncias/

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

// obtener denuncias con paginación
export async function GET({ url }: APIContext): Promise<Response> {
    try {
        const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
        const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 10));
        const escuelaId = url.searchParams.get("escuelaId");
        const localidadId = url.searchParams.get("localidadId");
        const fechaDesde = url.searchParams.get("fechaDesde");
        const fechaHasta = url.searchParams.get("fechaHasta");

        // Construcción dinámica del where
        const where: Record<string, unknown> = {};

        if (escuelaId) where.escuelaId = Number(escuelaId);
        if (localidadId) where.escuela = { localidadId: Number(localidadId) };

        if (fechaDesde || fechaHasta) {
            where.fecha_creacion = {
                ...(fechaDesde && { gte: new Date(fechaDesde) }),
                ...(fechaHasta && { lte: new Date(`${fechaHasta}T23:59:59.999Z`) }),
            };
        }

        const [denuncias, total] = await Promise.all([
            prisma.denuncia.findMany({
                where,
                include: {
                    escuela: {
                        include: { localidad: true },
                    },
                },
                orderBy: { fecha_creacion: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.denuncia.count({ where }),
        ]);

        return new Response(
            JSON.stringify({
                success: true,
                data: denuncias,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
                message: "Denuncias obtenidas correctamente",
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return errorResponse("Error al obtener las denuncias");
    }
}