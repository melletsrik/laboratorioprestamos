import React from 'react';

export default function DocenteTabla({ docentes }) {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50'>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {docentes.map((docentes, index) => (
            <tr key={index}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{docentes.persona?.nombre}</span>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{docentes.persona?.apellido}</span>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className={`font-medium ${docentes.activo ? 'text-green-600' : 'text-red-600'}`}>
                    {docentes.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
