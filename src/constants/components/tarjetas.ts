import type { PaginationMeta } from "../../lib/api/types";
import type { CardRatio } from "../../types/directorio/InterfaceTarjInformativas";



export interface TarjetasPaginatedData {
    items: Tarjeta[];
    pagination: PaginationMeta;
}

export const TARJETAS_PAGE = {
    TITLE: "Tarjetas",
    ADD_BUTTON: "Agregar tarjeta",
    UPLOADING: "Creando",
    ITEMS_PER_PAGE: 5,
    LOADING: "Cargando tarjetas...",
    NEW: "Nueva tarjeta",
}

export const MODAL_TEXTS = {
    DETAILS: "Detalles de la Tarjeta",
    NO_IMAGE: "Sin imagen",
    ID: "ID:",
    ENLACE: "Enlace:",
    DESCRIPCION: "Descripción:",
    CONTADOR: "Contador:",
    FECHA:"Fecha de Creacion:",
    BORRAR: "¿Desea eliminar esta tarjeta?",
    SEGURO: "Esta tarjeta será borrada permanentemente. Esta acción no se puede deshacer.",
    CANCELAR: "Cancelar",
    ELIMINAR: "Eliminar"
}

export const TABLE = {
    ADD:"No hay tarjetas. Haz clic en 'Agregar Tarjeta' para crear una."
}



export const HEADERS = {
    ID: "ID",
    ENLACE: "Enlace",
    DESCRIPCION: "Descripción",
    CONTADOR: "Contador",
    FECHA:"Fecha de Creación",
    OPCIONES:"Opciones"
}

export const RATIO_MAP = {
    "1:1": "aspect-square",
    "3:4": "aspect-[3/4]",
    "4:3": "aspect-[4/3]",
} as const satisfies Record<CardRatio, string>;

export const RATIO_DIMENSIONS = {
    "1:1": { width: 800, height: 800 },
    "3:4": { width: 900, height: 1200 },
    "4:3": { width: 1200, height: 900 },
} as const satisfies Record<CardRatio, { width: number; height: number }>;

export const RATIO_VALUES = {
    "1:1": 1,
    "3:4": 3 / 4,
    "4:3": 4 / 3,
} as const satisfies Record<CardRatio, number>;

export const RATIO_DEFAULT: CardRatio = "1:1";