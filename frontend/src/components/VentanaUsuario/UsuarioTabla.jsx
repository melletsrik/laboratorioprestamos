import React, { useState } from 'react';
import UsuarioSearchBar from './UsuarioSearchBar';

const ROL_MAP = {
  "Auxiliar": { label: 'Auxiliar', color: 'text-green-600' },
  "Administrativo": { label: 'Administrativo', color: 'text-blue-600' }
};
export default function UsuariosTabla({ usuarios = [], onCambiarEstado, onEditarUsuario }) {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50'>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
          
        </thead>
    
        <tbody className='bg-white divide-y divide-gray-200'>
        {usuarios.length === 0 ? (
          <tr>
            <td colSpan="6" className='px-6 py-4 text-center text-gray-500'>
              <div className='space-y-2'>
                <p>No hay auxiliares registrados</p>
              </div>
            </td>
          </tr>
          
        ) : usuarios.map((usuario, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{usuario.nombre}</span>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{usuario.apellido}</span>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{usuario.nombre_usuario}</span>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                  <span className={`font-medium ${ROL_MAP[usuario.rol.descripcion]?.color || 'text-gray-600'}`}>
                    {ROL_MAP[usuario.rol.descripcion]?.label || usuario.rol.descripcion}
                  </span>
              
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                <div className='flex items-center gap-2'>
                <button onClick={() => onCambiarEstado(usuario.id_usuario, !usuario.estado)} className={`px-2 py-1 text-sm rounded ${usuario.estado ? 'bg-gray-500' : 'bg-red-500'} text-white`} >
                {usuario.estado ? "Deshabilitado" : "Habilitado"}
                </button>
                <button 
                  onClick={() => onEditarUsuario(usuario)} 
                  className='px-2 py-1 text-sm rounded bg-blue-500 text-white ml-2'
                >
                  Editar
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};