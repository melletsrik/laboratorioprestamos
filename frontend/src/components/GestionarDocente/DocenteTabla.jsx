import React from 'react';
import Button from '../Button';
export default function DocenteTabla({ docentes, onCambiarEstado, onEditar }) {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50'>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editar</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {docentes.map((docente, index) => (
            <tr key={index}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {docente.persona?.nombre}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {docente.persona?.apellido}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <span className={`px-2 py-1 rounded-full text-xs font-bold
                  ${docente.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {docente.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <Button
                  variant="blue"
                  onClick={() => onEditar && onEditar(docente)}
                  className="px-1 py-0.5 rounded-md font-semibold transition-colors cursor-pointer w-full sm:w-auto"
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}