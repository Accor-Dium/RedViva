// PARA ACCEDER A ESTOS ENDPOINTS -> http://localhost:4321/api/denuncias/

import type { APIContext } from "astro";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, parseId } from "@/lib/api/helpers";

export async function DELETE({ params }: APIContext): Promise<Response> {
    const id = parseId(params.id);
    if (!id) return errorResponse("ID inválido", 400);

    try {
        const denuncia = await prisma.denuncia.findUnique({ where: { id } });

        if (!denuncia) return errorResponse("Denuncia no encontrada", 404);

        await prisma.denuncia.delete({ where: { id } });

        return successResponse(null, "Denuncia eliminada correctamente");
    } catch (error) {
        return errorResponse("Error al eliminar la denuncia");
    }
}