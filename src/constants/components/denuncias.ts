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

/** Respuesta paginada del endpoint GET /api/denuncias */
export interface DenunciasPaginatedResponse {
    success: boolean;
    data: DenunciaRow[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    message: string;
    timestamp: string;
}

/** Filtros disponibles */
export interface DenunciasFilters {
    escuelaId?: number;
    localidadId?: number;
    fechaDesde?: string;
}

/** Opción genérica para selects de filtros */
export interface FilterOption {
    id: number;
    nombre: string;
}

/** Constantes de la página */
export const DENUNCIAS_PAGE = {
    TITLE: "Denuncias",
    ADD_BUTTON: "Escuela",
    FILTER_LABEL: "Filtrar por:",
    FILTER_ESCUELA: "Escuela",
    FILTER_LOCALIDAD: "Localidad",
    FILTER_FECHA: "Fecha",
    EXPORT_BUTTON: "Exportar excel",
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
} as const;