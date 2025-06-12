import React, { useState } from 'react';
import MaterialSearchBar from './MaterialSearchBar';
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMinusSquare } from "react-icons/ai";

const MaterialTabla = ({materiales}) => {
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
        {materiales.length ===0 ?(
            <tr> 
                <td colSpan="5" className='px-6 py-4 text-center text-gray-500'>No hay materiales registrados</td>
            </tr>
        ) : (
             materiales.map((material, index) => (
          <tr key={material.id} className='hover:bg-gray-50'>
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{index+1}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{material.codigo}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{material.nombre}</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>+ {material.cantidad} -</td>
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                <div className='flex items-center space-x-2'>
                    <button onClick={() =>onAumentar(material.id)} className="text-green-600 hover:text-green-800 transition-colors hover:scale-110" title="Aumentar cantidad"> <CiSquarePlus size={20} /> </button>
        
                  
                 <button onClick={() => onDisminuir(material.id)} className='text-red-600 hover:text-red-800 transition-colors hover:scale-110' title='Disminuir Cantidad' disabled={material.cantidad <= 0} > <AiOutlineMinusSquare size={20} /></button>
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