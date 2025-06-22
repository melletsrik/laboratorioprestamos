import React from 'react';
import Button from '../Button'; 
export default function EstudianteTabla({ estudiantes, onEditar }) {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50'>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editar</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {estudiantes.map((estudiante, index) => (
            <tr key={index}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {estudiante.registro || estudiante.Registro}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {estudiante.nombre || estudiante.persona?.nombre}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {estudiante.apellido || estudiante.persona?.apellido}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                <Button
                  onClick={() => onEditar(estudiante)}
                  className="px-1 py-0.5 rounded-md font-semibold transition-colors cursor-pointer w-full sm:w-auto bg-gray-500 text-white"
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