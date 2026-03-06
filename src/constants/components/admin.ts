export interface AdminNavLink {
    label: string;
    href: string;
    icon: "dashboard" | "denuncias" | "tarjetas";
}

export const ADMIN_NAV_LINKS: readonly AdminNavLink[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { label: "Denuncias", href: "/admin/denuncias", icon: "denuncias" },
    { label: "Tarjetas Informativas", href: "/admin/tarjetas", icon: "tarjetas" },
] as const satisfies readonly AdminNavLink[];

export const ADMIN_SIDEBAR_CONSTANTS = {
    TITLE: "Administración",
    MENU_BUTTON_LABEL: "Abrir menú",
    COLLAPSE_LABEL: "Colapsar",
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