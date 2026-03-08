// PARA ACCEDER -> http://localhost:4321/api/denuncias/top-escuelas

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// Top 10 escuelas con más denuncias
export async function GET({ url }: APIContext): Promise<Response> {
    try {
        const fechaDesde = url.searchParams.get("fechaDesde");
        const fechaHasta = url.searchParams.get("fechaHasta");
        const grado = url.searchParams.get("grado");


        const where: Record<string, unknown> = {};


        if (fechaDesde || fechaHasta) {
            where.fecha_creacion = {
                ...(fechaDesde && { gte: new Date(fechaDesde) }),
                ...(fechaHasta && { lte: new Date(`${fechaHasta}T23:59:59.999Z`) }),
            };
        }


        if (grado && grado.trim().length > 0) {
            where.escuela = {
                grado: grado.trim(),
            };
        }


        const topEscuelas = await prisma.denuncia.groupBy({
            by: ['escuelaId'],
            where,
            _count: {
                escuelaId: true,
            },
            orderBy: {
                _count: {
                    escuelaId: 'desc',
                },
            },
            take: 10,
        });

        const escuelasIds = topEscuelas.map(item => item.escuelaId);
        
        const escuelasDetalles = await prisma.inst_educativa.findMany({
            where: {
                id: { in: escuelasIds },
            },
            select: {
                id: true,
                nombre: true,
            },
        });

        
        const resultado = topEscuelas.map(item => {
            const escuela = escuelasDetalles.find(e => e.id === item.escuelaId);
            return {
                nombre: escuela?.nombre || "Escuela no encontrada",
                denuncias: item._count.escuelaId,
            };
        });

        return successResponse(resultado, "Top 10 escuelas con más denuncias");
    } catch (error) {
        console.error(error);
        return errorResponse("Error al obtener el top de escuelas");
    }
}