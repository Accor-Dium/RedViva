import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/api/helpers";

// crear tarjeta
export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { descripcion, imagen, enlace } = body;

        // validaciones
        if (!descripcion || typeof descripcion !== "string" || descripcion.trim().length === 0) {
            return errorResponse("El campo 'descripcion' es requerido y debe ser un texto válido", 400);
        }

        if (!imagen || typeof imagen !== "string" || imagen.trim().length === 0) {
            return errorResponse("El campo 'imagen' es requerido y debe ser un texto válido", 400);
        }

        if (!enlace || typeof enlace !== "string" || enlace.trim().length === 0) {
            return errorResponse("El campo 'enlace' es requerido y debe ser un texto válido", 400);
        }

        const tarjeta = await prisma.tarj_informativas.create({
            data: {
                descripcion: descripcion.trim(),
                imagen: imagen.trim(),
                enlace: enlace.trim(),
            },
        });

        return successResponse(tarjeta, "Tarjeta informativa creada correctamente", 201);
    } catch (error) {
        return errorResponse("Error al crear la tarjeta informativa");
    }
}

// Paginación de tarjetas informativas
export async function GET({ url }: APIContext): Promise<Response> {
    try {
        const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
        const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 10));

        const [tarjetas, total] = await Promise.all([
            prisma.tarj_informativas.findMany({
                orderBy: { fecha_creacion: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.tarj_informativas.count(),
        ]);

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    items: tarjetas, 
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                },
                message: "Tarjetas informativas obtenidas correctamente",
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return errorResponse("Error al obtener las tarjetas informativas");
    }
}

