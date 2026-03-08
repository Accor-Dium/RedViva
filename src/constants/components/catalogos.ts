/** Constantes de la página de Catálogos */
export const CATALOGOS_PAGE = {
    TITLE: "Catálogos",

    TABS: {
        LOCALIDADES: "Localidades",
        ESCUELAS: "Escuelas",
    },

    LOCALIDADES: {
        FORM_TITLE: "Nueva Localidad",
        FIELD_NOMBRE: "Nombre de la localidad",
        PLACEHOLDER_NOMBRE: "Ej: San Juan de los Lagos",
        SUBMIT_BUTTON: "Agregar localidad",
        SUBMITTING_BUTTON: "Agregando...",
        SUCCESS_MESSAGE: "Localidad creada correctamente",
        TABLE_HEADERS: {
            ID: "ID",
            NOMBRE: "Nombre",
            FECHA: "Fecha de creación",
        },
        EMPTY_STATE: "No hay localidades registradas.",
    },

    ESCUELAS: {
        FORM_TITLE: "Nueva Escuela",
        FIELD_NOMBRE: "Nombre de la escuela",
        FIELD_GRADO: "Grado",
        FIELD_LOCALIDAD: "Localidad",
        PLACEHOLDER_NOMBRE: "Ej: Escuela Primaria Benito Juárez",
        PLACEHOLDER_GRADO: "Seleccionar grado",
        PLACEHOLDER_LOCALIDAD: "Seleccionar localidad",
        GRADOS: ["Preescolar", "Primaria", "Secundaria", "Preparatoria", "Universidad"] as const,
        SUBMIT_BUTTON: "Agregar escuela",
        SUBMITTING_BUTTON: "Agregando...",
        SUCCESS_MESSAGE: "Escuela creada correctamente",
        TABLE_HEADERS: {
            ID: "ID",
            NOMBRE: "Nombre",
            GRADO: "Grado",
            LOCALIDAD: "Localidad",
            FECHA: "Fecha de creación",
        },
        EMPTY_STATE: "No hay escuelas registradas.",
    },
} as const;