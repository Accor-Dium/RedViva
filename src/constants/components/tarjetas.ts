import type { PaginationMeta } from "../../lib/api/types";



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
    FECHA:"Fecha de Creacion:"
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