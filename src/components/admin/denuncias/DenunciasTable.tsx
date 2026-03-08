import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "../../../components/ui/pagination.tsx";
import { Trash, Eye } from "@phosphor-icons/react";
import { DENUNCIAS_PAGE } from "../../../constants/components/denuncias.ts";
import type { DenunciaRow } from "../../../constants/components/denuncias.ts";

interface DenunciasTableProps {
    denuncias: DenunciaRow[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onDelete: (id: number) => void;
    onView: (denuncia: DenunciaRow) => void;
}

const styles = {
    container: "flex flex-col gap-4",
    tableWrapper: "rounded-xl border border-gray-200 overflow-hidden",
    header: {
        row: "bg-purple-700 hover:bg-purple-700",
        cell: "text-white font-semibold",
        cellCenter: "text-white font-semibold text-center",
    },
    body: {
        empty: "text-center py-8 text-gray-500",
        cell: "font-medium",
        deleteButton: "inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer",
        viewButton: "inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer",
    },
    pagination: {
        disabled: "pointer-events-none opacity-50",
    },
} as const;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "ellipsis")[] = [1];

    if (current > 3) pages.push("ellipsis");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("ellipsis");

    pages.push(total);
    return pages;
}

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function truncate(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export default function DenunciasTable({
                                           denuncias,
                                           page,
                                           totalPages,
                                           onPageChange,
                                           onDelete,
                                           onView,
                                       }: DenunciasTableProps) {
    const { TABLE_HEADERS } = DENUNCIAS_PAGE;

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <Table>
                    <TableHeader>
                        <TableRow className={styles.header.row}>
                            <TableHead className={styles.header.cell}>{TABLE_HEADERS.DENUNCIA}</TableHead>
                            <TableHead className={styles.header.cell}>{TABLE_HEADERS.RESUMEN}</TableHead>
                            <TableHead className={styles.header.cell}>{TABLE_HEADERS.COMUNIDAD}</TableHead>
                            <TableHead className={styles.header.cell}>{TABLE_HEADERS.FECHA}</TableHead>
                            <TableHead className={styles.header.cellCenter}>{TABLE_HEADERS.OPCIONES}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {denuncias.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className={styles.body.empty}>
                                    {DENUNCIAS_PAGE.EMPTY_STATE}
                                </TableCell>
                            </TableRow>
                        ) : (
                            denuncias.map((denuncia) => (
                                <TableRow key={denuncia.id}>
                                    <TableCell className={styles.body.cell}>
                                        Denuncia #{denuncia.id}
                                    </TableCell>
                                    <TableCell>{truncate(denuncia.descripcion)}</TableCell>
                                    <TableCell>{denuncia.escuela.localidad.nombre}</TableCell>
                                    <TableCell>{formatDate(denuncia.fecha_creacion)}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => onView(denuncia)}
                                                className={styles.body.viewButton}
                                                title="Ver detalle"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(denuncia.id)}
                                                className={styles.body.deleteButton}
                                                title="Eliminar denuncia"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                text="Anterior"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) onPageChange(page - 1);
                                }}
                                aria-disabled={page === 1}
                                className={page === 1 ? styles.pagination.disabled : ""}
                            />
                        </PaginationItem>

                        {getPageNumbers(page, totalPages).map((pageNum, idx) =>
                            pageNum === "ellipsis" ? (
                                <PaginationItem key={`ellipsis-${idx}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href="#"
                                        isActive={pageNum === page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(pageNum);
                                        }}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}

                        <PaginationItem>
                            <PaginationNext
                                text="Siguiente"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) onPageChange(page + 1);
                                }}
                                aria-disabled={page === totalPages}
                                className={page === totalPages ? styles.pagination.disabled : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}