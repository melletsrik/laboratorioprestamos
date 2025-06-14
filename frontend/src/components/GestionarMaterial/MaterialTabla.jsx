import React, { useState } from 'react';
import MaterialSearchBar from './MaterialSearchBar';
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMinusSquare } from "react-icons/ai";

const MaterialTabla = ({materiales, onAumentar, onDisminuir}) => {
    return(
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <table className='w-full'>
            <thead className='bg-gray-50'>
                <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Codigo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Del Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
    
       <tbody className='bg-white divide-y divide-gray-200'>
        {materiales.length === 0 ? (
          <tr>
            <td colSpan="5" className='px-6 py-4 text-center text-gray-500'>
              <div className='space-y-2'>
                <p>No hay materiales registrados</p>
                <p className='text-sm text-gray-400'>¡Agrega tu primer material usando el botón "Agregar Material"!</p>
              </div>
            </td>
          </tr>
        ) : (
             materiales.map((material, index) => (
          <tr key={material.id_material} className='hover:bg-gray-50'>
             <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{index+1}</td>
             <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
               <div className='flex items-center gap-2'>
                 <span className='font-medium'>{material.codigo_material}</span>
               </div>
             </td>
             <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
               <div className='flex items-center gap-2'>
                 <span className='font-medium'>{material.nombre}</span>
               </div>
             </td>
             <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
               <div className='flex items-center gap-2'>
                 <span className='font-medium'>{material.cantidad_total}</span>
               </div>
             </td>
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                <div className='flex items-center space-x-2'>
                    <button onClick={() => onAumentar(material.codigo_material)} className="text-green-600 hover:text-green-800 transition-colors hover:scale-110" title="Aumentar cantidad"> <CiSquarePlus size={20} /> </button>
        
                  
                 <button onClick={() => onDisminuir(material.codigo_material)} className='text-red-600 hover:text-red-800 transition-colors hover:scale-110' title='Disminuir Cantidad' disabled={material.cantidad_total <= 0} > <AiOutlineMinusSquare size={20} /></button>
                </div> 
            </td>
          </tr>
        ))
        )}

      </tbody>
    </table>
    </div>
  );
};
       
export default MaterialTabla;