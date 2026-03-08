import type { APIContext } from "astro";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, parseId } from "@/lib/api/helpers";

/** DELETE /api/tarjetas/:id — Eliminar una tarjeta */
export async function DELETE({ params }: APIContext): Promise<Response> {
    const id = parseId(params.id);
    if (!id) return errorResponse("ID inválido", 400);

    try {
        const tarjeta = await prisma.tarj_informativas.findUnique({ where: { id } });

        if (!tarjeta) return errorResponse("Tarjeta no encontrada", 404);

        await prisma.tarj_informativas.delete({ where: { id } });

        return successResponse(null, "Tarjeta eliminada correctamente");
    } catch (error) {
        return errorResponse("Error al eliminar la tarjeta");
    }
}