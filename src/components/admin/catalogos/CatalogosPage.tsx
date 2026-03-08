import { useState } from "react";
import { CATALOGOS_PAGE } from "../../../constants/components/catalogos.ts";
import LocalidadesSection from "./LocalidadesSection.tsx";
import EscuelasSection from "./EscuelasSection.tsx";

const { TABS } = CATALOGOS_PAGE;

type Tab = "localidades" | "escuelas";

const styles = {
    container: "flex flex-col gap-6 w-full",
    title: "text-3xl font-bold text-gray-900",
    tabs: {
        wrapper: "flex gap-1 rounded-lg bg-gray-100 p-1 w-fit",
        button: "px-5 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
        active: "bg-white text-purple-700 shadow-sm",
        inactive: "text-gray-500 hover:text-gray-700",
    },
} as const;

export default function CatalogosPage() {
    const [activeTab, setActiveTab] = useState<Tab>("localidades");

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{CATALOGOS_PAGE.TITLE}</h1>

            <div className={styles.tabs.wrapper}>
                <button
                    className={`${styles.tabs.button} ${activeTab === "localidades" ? styles.tabs.active : styles.tabs.inactive}`}
                    onClick={() => setActiveTab("localidades")}
                >
                    {TABS.LOCALIDADES}
                </button>
                <button
                    className={`${styles.tabs.button} ${activeTab === "escuelas" ? styles.tabs.active : styles.tabs.inactive}`}
                    onClick={() => setActiveTab("escuelas")}
                >
                    {TABS.ESCUELAS}
                </button>
            </div>

            {activeTab === "localidades" ? (
                <LocalidadesSection />
            ) : (
                <EscuelasSection />
            )}
        </div>
    );
}