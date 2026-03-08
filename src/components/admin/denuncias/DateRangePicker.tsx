import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarBlank, X } from "@phosphor-icons/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
    fechaDesde?: string;
    fechaHasta?: string;
    placeholder?: string;
    onChange: (fechaDesde?: string, fechaHasta?: string) => void;
}

function toDateRange(fechaDesde?: string, fechaHasta?: string): DateRange | undefined {
    if (!fechaDesde) return undefined;
    return {
        from: new Date(fechaDesde + "T00:00:00"),
        to: fechaHasta ? new Date(fechaHasta + "T00:00:00") : undefined,
    };
}

function formatLabel(range: DateRange | undefined, placeholder: string): string {
    if (!range?.from) return placeholder;
    const from = format(range.from, "dd MMM yyyy", { locale: es });
    if (!range.to) return from;
    const to = format(range.to, "dd MMM yyyy", { locale: es });
    return `${from} – ${to}`;
}

const styles = {
    trigger: "rounded-full bg-purple-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-purple-700 hover:text-white border-none h-auto gap-2",
    clearButton: "rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-300 transition-colors cursor-pointer",
} as const;

export default function DateRangePicker({
                                            fechaDesde,
                                            fechaHasta,
                                            placeholder = "Fecha",
                                            onChange,
                                        }: DateRangePickerProps) {
    const dateRange = toDateRange(fechaDesde, fechaHasta);
    const hasValue = Boolean(fechaDesde || fechaHasta);

    const handleSelect = (range: DateRange | undefined) => {
        const from = range?.from ? format(range.from, "yyyy-MM-dd") : undefined;
        const to = range?.to ? format(range.to, "yyyy-MM-dd") : undefined;
        onChange(from, to);
    };

    const handleClear = () => {
        onChange(undefined, undefined);
    };

    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <Button variant="outline" className={styles.trigger}>
                        <CalendarBlank size={16} />
                        {formatLabel(dateRange, placeholder)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white rounded-lg border border-gray-200 shadow-lg" align="end">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        defaultMonth={dateRange?.from}
                        locale={es}
                    />
                </PopoverContent>
            </Popover>

            {hasValue && (
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={handleClear}
                >
                    <X size={12} className="inline mr-1" />
                    Limpiar fecha
                </button>
            )}
        </>
    );
}