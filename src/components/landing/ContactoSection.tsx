import { useState } from "react"
import { animate } from "motion/mini"
import { ContatoForm } from "./ContactoForm"
import { ScopeLimitationsModal } from "./ScopeLimitationsModal"
import {
    TITULO1,
    TITULO2,
    PARRAFO1,
    PARRAFO2,
    WHATSAPP_IMG,
    LINEA_WHATSAPP,
    BUTTON_TEXT,
    BACK_BUTTON_TEXT,
    HERO_TITLE,
    HERO_SUBTITLE,
    HERO_TEXT
} from "../../constants/pages/contacto"

const styles = {
    formContainer: "w-full flex flex-col gap-5 transition-container",
    backButton: "self-start text-sm text-gray-600 hover:text-gray-900 mb-5 font-semibold transition-colors",
    heroBlock: "flex flex-col items-center gap-0 mb-5",
    heroTitle: "text-3xl font-semibold leading-none text-black text-center",
    heroSubtitle: "text-4xl font-bold leading-none text-red-500 text-center",
    heroText: "text-lg text-black text-center",
    sectionContainer: "w-full flex flex-col items-center gap-5 transition-container",
    title: "text-xl font-bold text-black",
    paragraph: "text-center text-gray-700",
    whatsappImg: "hover:opacity-80 transition-opacity cursor-pointer rounded-2xl shadow-2xl",
    mainButton: "rounded-md font-semibold cursor-pointer transition-colors bg-red-400 hover:bg-red-500 text-white text-sm px-7 py-3"
}

export function ContactoSection() {
    const [showForm, setShowForm] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleTransition = async (callback: () => void) => {
        const element = document.querySelector('.transition-container')
        if (element) {
            await animate(element, { opacity: 0 }, { duration: 0.3 })
            callback()
            await animate(element, { opacity: 1 }, { duration: 0.3 })
        } else {
            callback()
        }
    }

    if (showForm) {
        return (
            <>
                <ScopeLimitationsModal 
                    isOpen={showModal} 
                    onClose={() => setShowModal(false)} 
                />
                <div className={styles.formContainer}>
                    <button
                        onClick={() => handleTransition(() => setShowForm(false))}
                        className={styles.backButton}
                    >
                        {BACK_BUTTON_TEXT}
                    </button>
                    <div className={styles.heroBlock}>
                        <h2 className={styles.heroTitle}>
                            {HERO_TITLE}
                        </h2>
                        <h1 className={styles.heroSubtitle}>
                            {HERO_SUBTITLE}
                        </h1>
                        <p className={styles.heroText}>
                            {HERO_TEXT}
                        </p>
                    </div>
                    <ContatoForm />
                </div>
            </>
        )
    }

    return (
        <div className={styles.sectionContainer}>
            <h1 className={styles.title}>
                {TITULO1}
            </h1>
            <p className={styles.paragraph}>
                {PARRAFO1}
            </p>
            <a href={LINEA_WHATSAPP} target="_blank" rel="noopener noreferrer">
                <img
                    src={WHATSAPP_IMG}
                    alt="Whatsapp"
                    width={336}
                    height={70}
                    className={styles.whatsappImg}
                />
            </a>
            <h1 className={styles.title}>
                {TITULO2}
            </h1>
            <p className={styles.paragraph}>
                {PARRAFO2}
            </p>
            <button
                onClick={() => handleTransition(() => {
                    setShowForm(true)
                    setShowModal(true)
                })}
                className={styles.mainButton}
            >
                {BUTTON_TEXT}
            </button>
        </div>
    )
}