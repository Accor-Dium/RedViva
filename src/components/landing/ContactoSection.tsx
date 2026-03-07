import { useState } from "react"
import { animate } from "motion/mini"
import { ContatoForm } from "./ContactoForm"
import { ScopeLimitationsModal } from "./ScopeLimitationsModal"
import { TITULO1, TITULO2, PARRAFO1, PARRAFO2, WHATSAPP_IMG, LINEA_WHATSAPP, BUTTON_TEXT } from "../../constants/pages/contacto"

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
                <div className="w-full flex flex-col gap-5 transition-container">
                    <button
                        onClick={() => handleTransition(() => setShowForm(false))}
                        className="self-start text-sm text-gray-600 hover:text-gray-900 mb-5 font-semibold transition-colors"
                    >
                        ← Volver
                    </button>
                    <div className="flex flex-col items-center gap-0 mb-5">
                        <h2 className="text-3xl font-semibold leading-none text-black text-center">
                            Tienes derecho a estar a salvo.
                        </h2>
                        <h1 className="text-4xl font-bold leading-none text-red-500 text-center">
                            Reporta aquí.
                        </h1>
                        <p className="text-lg text-black text-center">
                            Tu denuncia es confidencial
                        </p>
                    </div>
                    <ContatoForm />
                </div>
            </>
        )
    }

    return (
        <div className="w-full flex flex-col items-center gap-5 transition-container">
            <h1 className="text-xl font-bold text-black">
                {TITULO1}
            </h1>
            <p className="text-center text-gray-700">
                {PARRAFO1}
            </p>
            <a href={LINEA_WHATSAPP} target="_blank" rel="noopener noreferrer">
                <img
                    src={WHATSAPP_IMG}
                    alt="Whatsapp"
                    width={336}
                    height={70}
                    className="hover:opacity-80 transition-opacity cursor-pointer rounded-2xl shadow-2xl"
                />
            </a>
            <h1 className="text-xl font-bold text-black">
                {TITULO2}
            </h1>
            <p className="text-center text-gray-700">
                {PARRAFO2}
            </p>
            <button
                onClick={() => handleTransition(() => {
                    setShowForm(true)
                    setShowModal(true)
                })}
                className="rounded-md font-semibold cursor-pointer transition-colors bg-red-400 hover:bg-red-500 text-white text-sm px-7 py-3"
            >
                {BUTTON_TEXT}
            </button>
        </div>
    )
}