import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

/**
 * Operaciones sobre una tarjeta informativa específica
 * GET /api/tarjetas-informativas/[id] - Obtener una tarjeta
 * POST /api/tarjetas-informativas/[id] - Incrementar contador de visitas
 */

// Obtener una tarjeta específica por ID
export async function GET({ params }: APIContext): Promise<Response> {
    try {
        const id = parseInt(params.id || "", 10);

        if (isNaN(id) || id < 1) {
            return errorResponse("ID de tarjeta inválido", 400);
        }

        const tarjeta = await prisma.tarj_informativas.findUnique({
            where: { id },
        });

        if (!tarjeta) {
            return errorResponse("Tarjeta no encontrada", 404);
        }

        return successResponse(tarjeta, "Tarjeta obtenida correctamente");
    } catch (error) {
        console.error("Error al obtener tarjeta:", error);
        return errorResponse("Error al obtener la tarjeta");
    }
}

// Incrementar el contador de visitas
export async function POST({ params }: APIContext): Promise<Response> {
    try {
        const id = parseInt(params.id || "", 10);

        if (isNaN(id) || id < 1) {
            return errorResponse("ID de tarjeta inválido", 400);
        }

        // Verificar que la tarjeta existe
        const tarjeta = await prisma.tarj_informativas.findUnique({
            where: { id },
        });

        if (!tarjeta) {
            return errorResponse("Tarjeta no encontrada", 404);
        }

        // Incrementar el contador
        const tarjetaActualizada = await prisma.tarj_informativas.update({
            where: { id },
            data: {
                contador: {
                    increment: 1,
                },
            },
        });

        return successResponse(
            { contador: tarjetaActualizada.contador },
            "Contador incrementado correctamente"
        );
    } catch (error) {
        console.error("Error al incrementar contador:", error);
        return errorResponse("Error al incrementar el contador");
    }
}
