import type { APIContext } from "astro";
import { prisma } from "../../../lib/prisma"; 
import { successResponse, errorResponse } from "../../../lib/api/helpers";
import bcrypt from "bcryptjs";

export async function POST({ request }: APIContext): Promise<Response> {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return errorResponse("Usuario y contraseña obligatorios", 400);
        }

        // CONVERTIMOS A MINÚSCULAS AQUÍ:
        // .trim() quita espacios vacíos y .toLowerCase() ignora las mayúsculas
        const normalizedUsername = username.trim().toLowerCase();

        const usuario = await prisma.usuarios.findUnique({
            where: { username: normalizedUsername },
        });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return errorResponse("Credenciales incorrectas", 401);
        }

        const { password: _, ...userData } = usuario;
        return successResponse(userData, "Sesión iniciada");

    } catch (error) {
        console.error("Login Error:", error);
        return errorResponse("Error interno del servidor");
    }
}