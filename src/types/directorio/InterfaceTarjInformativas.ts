export interface TarjetaInformativa {
    id: number;
    descripcion: string;
    imagen: string | null;
    enlace: string;
    contador: number;
    fecha_creacion: string;
}

export type CardRatio = "1:1" | "3:4" | "4:3";