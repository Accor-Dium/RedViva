import { useState, useRef, useEffect } from "react"
import { getEscuelas, getTurnos } from "../../services/catalogos.services.ts"
import { postDenuncia } from "../../services/denuncias.services"
import { SuccessModal } from "./SuccessModal"
import type { ComboboxItem, ComboboxProps } from "../../types/contacto/interfaces"

// ─── Combobox con búsqueda ──────────────────────────────────────────────────

const comboboxStyles = {
    container: "relative",
    input:     "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300",
    list:      "absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto",
    emptyItem: "px-3 py-2 text-sm text-gray-400",
    item:      "px-3 py-2 text-sm cursor-pointer hover:bg-red-50 hover:text-red-700",
}



function Combobox({ id, name, placeholder, items, value, onSelect }: ComboboxProps) {
    const [query, setQuery]   = useState("")
    const [open, setOpen]     = useState(false)
    const containerRef        = useRef<HTMLDivElement>(null)

    const filtered = query.trim()
        ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
        : items

    // Cerrar si se hace click fuera
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleOutside)
        return () => document.removeEventListener("mousedown", handleOutside)
    }, [])

    function handleSelect(item: ComboboxItem) {
        setQuery(item.label)
        onSelect(item)
        setOpen(false)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value)
        onSelect({ label: "", value: "" })
        setOpen(true)
    }

    return (
        <div className={comboboxStyles.container} ref={containerRef}>
            <input
                id={id}
                type="text"
                autoComplete="off"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onFocus={() => setOpen(true)}
                className={comboboxStyles.input}
            />
            {/* valor real que se envía */}
            <input type="hidden" name={name} value={value} />

            {open && (
                <ul className={comboboxStyles.list}>
                    {filtered.length === 0 ? (
                        <li className={comboboxStyles.emptyItem}>Sin resultados</li>
                    ) : (
                        filtered.map(item => (
                            <li
                                key={item.value}
                                onMouseDown={() => handleSelect(item)}
                                className={comboboxStyles.item}
                            >
                                {item.label}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}

// ─── Formulario principal ───────────────────────────────────────────────────

const formStyles = {
    form:        "w-full flex flex-col gap-5",
    field:       "flex flex-col gap-1",
    label:       "text-sm font-semibold text-gray-700",
    textarea:    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none",
    statusOk:    "text-sm text-center text-green-600",
    statusError: "text-sm text-center text-red-500",
    button:      "self-center rounded-md font-semibold cursor-pointer transition-colors bg-red-400 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm px-7 py-3",
}

export function ContatoForm() {
    const [escuelas, setEscuelas] = useState<ComboboxItem[]>([])
    const [turnos,   setTurnos]   = useState<ComboboxItem[]>([])

    const [escuela,     setEscuela]     = useState<ComboboxItem>({ label: "", value: "" })
    const [turno,       setTurno]       = useState<ComboboxItem>({ label: "", value: "" })
    const [descripcion, setDescripcion] = useState("")

    const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [resetKey, setResetKey] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        getEscuelas()
            .then(data => setEscuelas(data.map(e => ({ label: e.nombre, value: String(e.id) }))))
            .catch(() => setEscuelas([]))

        getTurnos().then(data =>
            setTurnos(Object.entries(data).map(([id, nombre]) => ({ label: nombre, value: id })))
        )
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!escuela.value || !turno.value || !descripcion.trim()) {
            setStatus({ msg: "Por favor completa todos los campos.", ok: false })
            return
        }

        try {
            setIsSubmitting(true)
            await postDenuncia({
                escuelaId: Number(escuela.value),
                turno: turno.label,
                descripcion: descripcion.trim(),
            })
            setStatus({ msg: "¡Denuncia enviada con éxito!", ok: true })
            setShowSuccess(true)
        } catch {
            setStatus({ msg: "Ocurrió un error al enviar la denuncia. Inténtalo de nuevo.", ok: false })
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleModalAccept() {
        setShowSuccess(false)
        setEscuela({ label: "", value: "" })
        setTurno({ label: "", value: "" })
        setDescripcion("")
        setStatus(null)
        setResetKey(k => k + 1)
    }

    return (
        <>
        <SuccessModal isOpen={showSuccess} onAccept={handleModalAccept} />
        <form onSubmit={handleSubmit} className={formStyles.form} noValidate>

            {/* Escuela */}
            <div className={formStyles.field}>
                <label htmlFor="escuela-input" className={formStyles.label}>
                    Escuela
                </label>
                <Combobox
                    key={`escuela-${resetKey}`}
                    id="escuela-input"
                    name="escuela"
                    placeholder="Buscar escuela…"
                    items={escuelas}
                    value={escuela.value}
                    onSelect={setEscuela}
                />
            </div>

            {/* Turno */}
            <div className={formStyles.field}>
                <label htmlFor="turno-input" className={formStyles.label}>
                    Turno
                </label>
                <Combobox
                    key={`turno-${resetKey}`}
                    id="turno-input"
                    name="turno"
                    placeholder="Buscar turno…"
                    items={turnos}
                    value={turno.value}
                    onSelect={setTurno}
                />
            </div>

            {/* Descripción */}
            <div className={formStyles.field}>
                <label htmlFor="descripcion" className={formStyles.label}>
                    Descripción de la denuncia
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    placeholder="Describe lo ocurrido…"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    className={formStyles.textarea}
                />
            </div>

            {/* Mensaje de estado */}
            {status && (
                <p className={status.ok ? formStyles.statusOk : formStyles.statusError}>
                    {status.msg}
                </p>
            )}

            {/* Enviar */}
            <button type="submit" disabled={isSubmitting} className={formStyles.button}>
                {isSubmitting ? (
                    <>
                        <svg className="inline-block mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Enviando…
                    </>
                ) : "Enviar denuncia"}
            </button>
        </form>
        </>
    )
}
