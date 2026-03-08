import type { PaginationMeta } from "../../lib/api/types";

/** Tipado de una denuncia como viene del API */
export interface DenunciaRow {
    id: number;
    descripcion: string;
    turno: string;
    fecha_creacion: string;
    escuela: {
        id: number;
        nombre: string;
        localidad: {
            id: number;
            nombre: string;
        };
    };
}

/** Lo que viene dentro de data en el GET paginado */
export interface DenunciasPaginatedData {
    items: DenunciaRow[];
    pagination: PaginationMeta;
}

/** Filtros disponibles */
export interface DenunciasFilters {
    escuelaId?: number;
    grado?: string;
    localidadId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
}

/** Opción genérica para selects de filtros */
export interface FilterOption {
    id: number;
    nombre: string;
}

/** Constantes de la página */
export const DENUNCIAS_PAGE = {
    TITLE: "Denuncias",
    FILTER_LABEL: "Filtrar por:",
    FILTER_ESCUELA: "Escuela",
    FILTER_LOCALIDAD: "Localidad",
    FILTER_FECHA: "Fecha",
    EXPORT_BUTTON: "Exportar excel",
    EXPORTING_BUTTON: "Exportando...",
    ITEMS_PER_PAGE: 10,
    EMPTY_STATE: "No se encontraron denuncias.",
    TABLE_HEADERS: {
        DENUNCIA: "Denuncia",
        RESUMEN: "Resumen",
        COMUNIDAD: "Comunidad",
        FECHA: "Fecha",
        OPCIONES: "Opciones",
    },
    DELETE_MODAL: {
        TITLE: "¿Estás seguro?",
        DESCRIPTION:
            "Esta acción es irreversible. La denuncia será eliminada permanentemente y no podrá ser recuperada.",
        CONFIRM: "Eliminar",
        CANCEL: "Cancelar",
        DELETING: "Eliminando...",
    },
    EXCEL: {
        FILENAME: "denuncias",
        SHEET_NAME: "Denuncias",
        COLUMNS: {
            ID: "ID",
            ESCUELA: "Escuela",
            LOCALIDAD: "Localidad",
            TURNO: "Turno",
            DESCRIPCION: "Descripción",
            FECHA: "Fecha de creación",
        },
    },
} as const;