// PARA ACCEDER -> http://localhost:4321/api/denuncias/denuncias-turno

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// Distribución de denuncias por turno
export async function GET({ url }: APIContext): Promise<Response> {
    try {
        const fechaDesde = url.searchParams.get("fechaDesde");
        const fechaHasta = url.searchParams.get("fechaHasta");
        const grado = url.searchParams.get("grado");

        // Construcción del where para filtros
        const where: Record<string, unknown> = {};

        // Filtro de fechas
        if (fechaDesde || fechaHasta) {
            where.fecha_creacion = {
                ...(fechaDesde && { gte: new Date(fechaDesde) }),
                ...(fechaHasta && { lte: new Date(`${fechaHasta}T23:59:59.999Z`) }),
            };
        }

        // Filtro de grado
        if (grado && grado.trim().length > 0) {
            where.escuela = {
                grado: grado.trim(),
            };
        }

        // Obtener todas las denuncias con el turno
        const denuncias = await prisma.denuncia.findMany({
            where,
            select: {
                turno: true,
            },
        });

        // Agrupar y contar por turno
        const distribucion = denuncias.reduce((acc, denuncia) => {
            const turno = denuncia.turno;
            if (!acc[turno]) {
                acc[turno] = 0;
            }
            acc[turno]++;
            return acc;
        }, {} as Record<string, number>);

        // Convertir a array y ordenar por cantidad de denuncias (descendente)
        const resultado = Object.entries(distribucion)
            .map(([turno, denuncias]) => ({
                turno,
                denuncias,
            }))
            .sort((a, b) => b.denuncias - a.denuncias);

        return successResponse(resultado, "Distribución de denuncias por turno");
    } catch (error) {
        console.error(error);
        return errorResponse("Error al obtener la distribución por turno");
    }
}