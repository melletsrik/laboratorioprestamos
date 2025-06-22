import React from 'react';

export default function MateriaTabla({ materia = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Materia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carrera
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {materia.length === 0 ? (
            <tr>
              <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                No hay materias registradas
              </td>
            </tr>
          ) : (
            materia.map((m) => (
              <tr key={m.id_materia || m.id || m.nombre} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {m.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {m.carrera?.nombre || "Sin carrera asignada"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
