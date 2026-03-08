export interface TarjetaInformativa {
    id: number;
    descripcion: string;
    imagen: string | null;
    enlace: string;
    contador: number;
    fecha_creacion: Date;
}