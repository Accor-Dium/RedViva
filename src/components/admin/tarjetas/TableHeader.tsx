import { HEADERS } from "@/constants/components/tarjetas"



function RowHeader() {
    const STYLES = {
        row: "w-full shadow-md rounded-xl bg-purple-500 border border-gray-200 items-center flex py-4 hover:scale-101 transition-transform duration-300 min-h-[80px]",
        grid: "grid grid-cols-5 gap-4 w-full items-center h-full",
        title: "col-span-1 text-center",
        column: "col-span-1 text-center line-clamp-2 items-center flex justify-center overflow-hidden h-full",
        columnSpan: "line-clamp-1 font-bold text-white",
        columnSpan2: "line-clamp-2 font-bold text-white",
        actionColumn: "col-span-1 flex justify-center items-center h-full",
    }
    return (
        <section className={STYLES.row} >
            <div className={STYLES.grid}>
                <div className={STYLES.column}>
                    <span className={STYLES.columnSpan}>{HEADERS.ID}</span>
                </div>
                <div className={STYLES.column}>
                    <span className={STYLES.columnSpan2}>{HEADERS.DESCRIPCION}</span>
                </div>
                <div className={STYLES.column}>
                    <span className={STYLES.columnSpan}>{HEADERS.CONTADOR}</span>
                </div>
                <div className={STYLES.column}>
                    <span className={STYLES.columnSpan}>{HEADERS.FECHA}</span>
                </div>
                <div className={STYLES.column}>
                    <span className={STYLES.columnSpan}>{HEADERS.OPCIONES}</span>
                </div>
            </div>
        </section>
    )
}

export default RowHeader
