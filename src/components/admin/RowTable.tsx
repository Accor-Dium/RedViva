import React from 'react'
interface RowTableProps {
    id: number;
    titulo ?: string;
    descripcion?: string;
    descargas?: string;
    fecha?: string;
}
function RowTable( props: RowTableProps) {
  return (
    <section className="shadow-md rounded-xl bg-clip-border border border-gray-200 p-4" 
    style={{viewTransitionName: `row-${props.id}`,}}>
        <div className='grid grid-cols-5 gap-4 w-full'>
            <div className="col-span-1 text-center">{props.titulo}</div>
            <div className="col-span-1 text-center">{props.descripcion}</div>
            <div className="col-span-1 text-center">{props.descargas}</div>
            <div className="col-span-1 text-center">{props.fecha}</div>
            <div className="col-span-1 text-center">Opciones</div>
        </div>
    </section>
  )
}

export default RowTable