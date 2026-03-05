import React, { useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import RowTable from './RowTable';
import { date } from 'astro:schema';

export default function Table() {
  const nextIdRef = useRef(0);

  type Tarjeta = {
    id: number;
    titulo ?: string;
    descripcion?: string;
    descargas?: string;
    fecha?: string;
  };

  const [rows, setRows] = useState<Tarjeta[]>([]);

  function addRow(name: string) {
    const newId = nextIdRef.current++;
    const newRow = {
      id: newId,
      titulo: `${name} #${newId}`,
      descripcion: 'Developer',
      descargas: newId.toString(),
      fecha: new Date().toLocaleDateString()
    };

    (document).startViewTransition(() => {
      setRows((prev) => [newRow, ...prev]);
    });
  }

  return (
    <>
      <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded text-white mb-4 cursor-pointer" onClick={() => addRow("Nueva fila")}>
        Add
      </button>

      <div className="space-y-3">
        {rows.map((row) => (
          <RowTable
            key={row.id}
            id={row.id}
            titulo={row.titulo}
            descripcion={row.descripcion}
            descargas={row.descargas}
            fecha={row.fecha}
          />
        ))}
      </div>
    </>
  )
}