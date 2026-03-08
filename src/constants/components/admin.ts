export interface AdminNavLink {
    label: string;
    href: string;
    icon: "estadisticas" | "denuncias" | "tarjetas";
}

export const ADMIN_NAV_LINKS: readonly AdminNavLink[] = [
    { label: "Estadísticas", href: "/admin/estadisticas", icon: "estadisticas" },
    { label: "Denuncias", href: "/admin/denuncias", icon: "denuncias" },
    { label: "Tarjetas Informativas", href: "/admin/tarjetasInformativas", icon: "tarjetas" },
    { label: "Catálogos", href: "/admin/catalogos", icon: "catalogos" },
] as const satisfies readonly AdminNavLink[];

export const ADMIN_SIDEBAR_CONSTANTS = {
    TITLE: "Administración",
    MENU_BUTTON_LABEL: "Abrir menú",
    COLLAPSE_LABEL: "Colapsar",
    EXPAND_LABEL: "Expandir",
    STORAGE_KEY: "admin-sidebar-collapsed",
} as const;

export const ADMIN_ICON_PATHS: Record<AdminNavLink["icon"], string> = {
    estadisticas: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    denuncias: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    tarjetas: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    catalogos: "M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5zm0 0A2.5 2.5 0 016.5 17H20M9 2v8l2.5-2 2.5 2V2",
} as const;

export const ADMIN_COLORS = {
    sidebar: {
        bg: "bg-white",
        border: "border-gray-200",
        textActive: "text-white",
        bgActive: "bg-purple-600",
        textInactive: "text-gray-600",
        bgHover: "hover:bg-purple-50",
        logo: "text-gray-800",
    },
    content: {
        bg: "bg-gray-100",
        text: "text-gray-800",
    },
    card: {
        bg: "bg-white",
        border: "border-gray-200",
        shadow: "shadow-sm",
    },
    accent: {
        primary: "bg-purple-600",
        primaryHover: "hover:bg-purple-700",
        primaryText: "text-purple-600",
    },
} as const;