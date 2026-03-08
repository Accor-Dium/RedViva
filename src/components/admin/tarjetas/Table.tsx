import { TABLE } from '@/constants/components/tarjetas';
import RowTable from './RowTable';
import type { TableProps } from '@/types/TableProps';

export default function Table({ rows }: TableProps) {
  return (
    <>
      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {TABLE.ADD}
          </p>
        ) : (
          
          rows.map((row: Tarjeta) => (
            <RowTable
              key={row.id}
              id={row.id}
              enlace={row.enlace}
              imagen={row.imagen}
              descripcion={row.descripcion}
              contador={row.contador}
              fecha_creacion={row.fecha_creacion}
            />
          ))
        )}
      </div>
    </>
  );
}