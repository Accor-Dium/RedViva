import { prisma } from "../../lib/prisma";

export async function POST({request}: {request: Request}) {
    const { correo, descripcion } = await request.json();

    try {
        await prisma.modeloEjemplo.create({
        data: {
            correo,
            descripcion
        }
    })
    } catch (error) {
        return new Response(
            JSON.stringify({message: "Error tilin"}),
            { status: 409 }
        )
    }

    return new Response(
        JSON.stringify({ message: "Registro de ejemplo guardado "}),
        { status: 200 }
    );
}