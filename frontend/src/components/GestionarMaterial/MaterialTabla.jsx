import React, { useState } from 'react';
import { FaRegSave } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineMinusSquare } from "react-icons/ai";

const MaterialTabla = ({ materiales, onAumentar, onDisminuir, onEditarCantidad }) => {
  const [cantidadesEditadas, setCantidadesEditadas] = useState({});

  const handleCantidadChange = (codigo, nuevaCantidad) => {
    setCantidadesEditadas(prev => ({
      ...prev,
      [codigo]: parseInt(nuevaCantidad)
    }));
  };

  const guardarCantidad = (codigo) => {
    const nuevaCantidad = cantidadesEditadas[codigo];
    if (!isNaN(nuevaCantidad)) {
      onEditarCantidad(codigo, nuevaCantidad);
    }
  };
    return(
    <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
        <table className='w-full'>
            <thead className='bg-gray-50'>
                <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Codigo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Del Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editar Cantidad</th>
                </tr>
            </thead>
    
       <tbody className='bg-white divide-y divide-gray-200'>
        {materiales.length === 0 ? (
          <tr>
            <td colSpan="5" className='px-6 py-4 text-center text-gray-500'>
              <div className='space-y-2'>
                <p>No hay materiales registrados</p>
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
                         <input type="number" min="0"
                      className='w-16 text-center border border-gray-300 rounded px-1 py-1'
                      value={cantidadesEditadas[material.codigo_material] ?? material.cantidad_total}
                      onChange={(e) => handleCantidadChange(material.codigo_material, e.target.value)}
                    />

                    <button  onClick={() => guardarCantidad(material.codigo_material)}
                      className="text-red-600 hover:text-green-900 px-2"
                      title="Guardar cambio"
                    >
                      <FaRegSave size={20} />
                    </button>
                   
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