// PARA ACCEDER -> http://localhost:4321/api/denuncias/denuncias-grado

import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// Distribución de denuncias por grado
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


        const denuncias = await prisma.denuncia.findMany({
            where,
            select: {
                escuela: {
                    select: {
                        grado: true,
                    },
                },
            },
        });


        const distribucion = denuncias.reduce((acc, denuncia) => {
            const gradoEscuela = denuncia.escuela.grado;
            if (!acc[gradoEscuela]) {
                acc[gradoEscuela] = 0;
            }
            acc[gradoEscuela]++;
            return acc;
        }, {} as Record<string, number>);


        const resultado = Object.entries(distribucion)
            .map(([grado, denuncias]) => ({
                grado,
                denuncias,
            }))
            .sort((a, b) => b.denuncias - a.denuncias);

        return successResponse(resultado, "Distribución de denuncias por grado");
    } catch (error) {
        return errorResponse("Error al obtener la distribución por grado");
    }
}