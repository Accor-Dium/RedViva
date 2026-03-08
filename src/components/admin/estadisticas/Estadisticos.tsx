import { useState, useEffect } from 'react'
import ChartPie from './ChartPie'
import ChartBar from './ChartBar'
import ChartPieDonut from './ChartPieDonut'
import StatsFilterBar from './FilterBar'
import type { DenunciasFilters } from "../../../constants/components/denuncias.ts";
import { 
    getTopEscuelas, 
    getDistribucionGrado, 
    getDenunciasLocalidad, 
    getDenunciasTurno 
} from '../../../services/denuncias.services.ts'

import type { 
    TopEscuela, 
    DistribucionGrado, 
    DistribucionLocalidad, 
    DistribucionTurno 
} from '../../../types/denuncias/interfaces.ts'

import { TEXTS } from "../../../constants/components/Estadisticos.ts"

const COLORS = {
    pie: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4", "#ec4899", "#f97316", "#14b8a6", "#a855f7"],
    bar: "#8b5cf6",
}

function Estadisticos() {
    const [filters, setFilters] = useState<DenunciasFilters>({});
    const [loading, setLoading] = useState(true);
    
    const [topEscuelas, setTopEscuelas] = useState<TopEscuela[]>([]);
    const [distribucionGrado, setDistribucionGrado] = useState<DistribucionGrado[]>([]);
    const [denunciasLocalidad, setDenunciasLocalidad] = useState<DistribucionLocalidad[]>([]);
    const [denunciasTurno, setDenunciasTurno] = useState<DistribucionTurno[]>([]);

    const grados = ["Kinder","Primaria", "Secundaria", "Preparatoria"];


    const fetchData = async () => {
        setLoading(true);
        try {
            const [topEsc, distGrado, denLocal, denTurno] = await Promise.all([
                getTopEscuelas(filters),
                getDistribucionGrado(filters),
                getDenunciasLocalidad(filters),
                getDenunciasTurno(filters),
            ]);

            setTopEscuelas(topEsc);
            setDistribucionGrado(distGrado);
            setDenunciasLocalidad(denLocal);
            setDenunciasTurno(denTurno);
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [filters]);


    const chartBarData = topEscuelas.map(item => ({
        label: item.nombre,
        value: item.denuncias,
    }));


    const chartPieGradoData = distribucionGrado.map((item, index) => ({
        name: item.grado,
        value: item.denuncias,
        color: COLORS.pie[index % COLORS.pie.length],
    }));

    
    const chartPieLocalidadData = denunciasLocalidad.map((item, index) => ({
        name: item.localidad,
        value: item.denuncias,
        color: COLORS.pie[index % COLORS.pie.length],
    }));


    const chartDonutTurnoData = denunciasTurno.map((item, index) => ({
        name: item.turno,
        value: item.denuncias,
        color: COLORS.pie[index % COLORS.pie.length],
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">{TEXTS.CARGANDO}</p>
            </div>
        );
    }

    const STYLES ={
        main: "space-y-6",
        grid: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }

    return (
        <div className={STYLES.main}>
            <StatsFilterBar 
                grados={grados}
                filters={filters}
                onFilterChange={setFilters}
            />
            
            <div className={STYLES.grid}>
                
                <ChartBar
                    data={chartBarData}
                    color={COLORS.bar}
                    title="Top 10 Escuelas con más Denuncias"
                    description={filters.fechaDesde || filters.fechaHasta 
                        ? `${filters.fechaDesde || '...'} - ${filters.fechaHasta || '...'}` 
                        : "Todas las fechas"}
                    dataLabel="Denuncias"
                    footerText={`Total: ${topEscuelas.reduce((sum, e) => sum + e.denuncias, 0)} denuncias`}
                    height={300}
                />

                
                <ChartPie
                    data={chartPieGradoData}
                    title="Distribución por Grado"
                    description={filters.fechaDesde || filters.fechaHasta 
                        ? `${filters.fechaDesde || '...'} - ${filters.fechaHasta || '...'}` 
                        : "Todas las fechas"}
                    footerText={`Total: ${distribucionGrado.reduce((sum, g) => sum + g.denuncias, 0)} denuncias`}
                />

                
                <ChartPie
                    data={chartPieLocalidadData}
                    title="Denuncias por Localidad"
                    description={filters.fechaDesde || filters.fechaHasta 
                        ? `${filters.fechaDesde || '...'} - ${filters.fechaHasta || '...'}` 
                        : "Todas las fechas"}
                    footerText={`Total: ${denunciasLocalidad.reduce((sum, l) => sum + l.denuncias, 0)} denuncias`}
                />

                <ChartPieDonut
                    data={chartDonutTurnoData}
                    title="Denuncias por Turno"
                    description={filters.fechaDesde || filters.fechaHasta 
                        ? `${filters.fechaDesde || '...'} - ${filters.fechaHasta || '...'}` 
                        : "Todas las fechas"}
                    footerText={`Total: ${denunciasTurno.reduce((sum, t) => sum + t.denuncias, 0)} denuncias`}
                    showTrendingIcon={false}
                    innerRadius={60}
                    maxHeight={200}
                />
            </div>
        </div>
    )
}

export default Estadisticos