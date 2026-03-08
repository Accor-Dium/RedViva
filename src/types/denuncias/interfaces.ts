export interface DenunciaPayload {
    escuelaId: number;
    turno: string;
    descripcion: string;
}
export interface TopEscuela {
    nombre: string;
    denuncias: number;
}

export interface DistribucionGrado {
    grado: string;
    denuncias: number;
}

export interface DistribucionLocalidad {
    localidad: string;
    denuncias: number;
}

export interface DistribucionTurno {
    turno: string;
    denuncias: number;
}