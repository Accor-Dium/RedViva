// PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/denuncias/

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";
import { parsePositiveInt, parseDate } from "../../../lib/api/helpers";

// crear denuncia
export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { escuelaId, turno, descripcion } = body;

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

        const rawEscuelaId = url.searchParams.get("escuelaId");
        const rawLocalidadId = url.searchParams.get("localidadId");
        const rawFechaDesde = url.searchParams.get("fechaDesde");
        const rawFechaHasta = url.searchParams.get("fechaHasta");

        const escuelaId = parsePositiveInt(rawEscuelaId);
        const localidadId = parsePositiveInt(rawLocalidadId);

        if (rawEscuelaId && !escuelaId) {
            return errorResponse("El parámetro 'escuelaId' debe ser un número entero positivo", 400);
        }
        if (rawLocalidadId && !localidadId) {
            return errorResponse("El parámetro 'localidadId' debe ser un número entero positivo", 400);
        }

        const fechaDesde = parseDate(rawFechaDesde);
        const fechaHasta = parseDate(rawFechaHasta);

        if (rawFechaDesde && !fechaDesde) {
            return errorResponse("El parámetro 'fechaDesde' debe ser una fecha válida (YYYY-MM-DD)", 400);
        }
        if (rawFechaHasta && !fechaHasta) {
            return errorResponse("El parámetro 'fechaHasta' debe ser una fecha válida (YYYY-MM-DD)", 400);
        }

        // Construcción dinámica del where
        const where: Record<string, unknown> = {};

        if (escuelaId) where.escuelaId = escuelaId;
        if (localidadId) where.escuela = { localidadId };

        if (fechaDesde || fechaHasta) {
            const fechaFilter: Record<string, Date> = {};

            // Offset del navegador en minutos (ej: 360 para UTC-6)
            const tzOffsetMs = (Number(url.searchParams.get("tz")) || 0) * 60 * 1000;

            if (fechaDesde) {
                fechaFilter.gte = new Date(
                    Date.UTC(
                        fechaDesde.getUTCFullYear(),
                        fechaDesde.getUTCMonth(),
                        fechaDesde.getUTCDate(),
                        0, 0, 0, 0
                    ) + tzOffsetMs
                );
            }

            if (fechaHasta) {
                fechaFilter.lte = new Date(
                    Date.UTC(
                        fechaHasta.getUTCFullYear(),
                        fechaHasta.getUTCMonth(),
                        fechaHasta.getUTCDate(),
                        23, 59, 59, 999
                    ) + tzOffsetMs
                );
            }

            where.fecha_creacion = fechaFilter;
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

        const paginatedData = {
            items: denuncias,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

        return successResponse(paginatedData, "Denuncias obtenidas correctamente");
    } catch (error) {
        return errorResponse("Error al obtener las denuncias");
    }
}