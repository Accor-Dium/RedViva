import * as XLSX from "xlsx";
import type { DenunciaRow } from "../constants/components/denuncias";
import { DENUNCIAS_PAGE } from "../constants/components/denuncias";

const { EXCEL } = DENUNCIAS_PAGE;

interface ExcelRow {
    [EXCEL.COLUMNS.ID]: number;
    [EXCEL.COLUMNS.ESCUELA]: string;
    [EXCEL.COLUMNS.LOCALIDAD]: string;
    [EXCEL.COLUMNS.TURNO]: string;
    [EXCEL.COLUMNS.DESCRIPCION]: string;
    [EXCEL.COLUMNS.FECHA]: string;
}

/**
 * Convierte un array de denuncias a un archivo Excel y dispara la descarga.
 */
export function exportDenunciasToExcel(denuncias: DenunciaRow[]): void {
    const rows: ExcelRow[] = denuncias.map((d) => ({
        [EXCEL.COLUMNS.ID]: d.id,
        [EXCEL.COLUMNS.ESCUELA]: d.escuela.nombre,
        [EXCEL.COLUMNS.LOCALIDAD]: d.escuela.localidad.nombre,
        [EXCEL.COLUMNS.TURNO]: d.turno,
        [EXCEL.COLUMNS.DESCRIPCION]: d.descripcion,
        [EXCEL.COLUMNS.FECHA]: new Date(d.fecha_creacion).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Ajustar ancho de columnas automáticamente
    const colWidths = Object.keys(rows[0] || {}).map((key) => {
        const maxLen = Math.max(
            key.length,
            ...rows.map((row) => String(row[key as keyof ExcelRow] ?? "").length)
        );
        return { wch: Math.min(maxLen + 2, 60) };
    });
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, EXCEL.SHEET_NAME);

    const timestamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${EXCEL.FILENAME}_${timestamp}.xlsx`);
}