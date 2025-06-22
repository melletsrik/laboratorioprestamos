import React, { useState } from 'react';
import { IoMdSearch } from "react-icons/io";

// Componente de búsqueda de usuarios
const UsuarioBusqueda = ({ onBuscar }) => {
  // Estado para almacenar lo que el usuario escribe en el campo de búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Función que se ejecuta cada vez que el usuario escribe en el input
  const handleSearch = (e) => {
    const valor = e.target.value.toLowerCase(); // Convertimos a minúsculas
    setBusqueda(valor); // Guardamos el valor en el estado local
    onBuscar(valor); // Llamamos a la función del componente padre para filtrar los usuarios
  };

  return (
     <form className="w-full max-w-xl ">
        <div className='relative'>
            {/* dentro de buscar y los bordes , py= padding de alto*/}
           <input type="Search" placeholder='Buscar..' value={busqueda} onChange={handleSearch} className='w-full pl-10 pr-4 py-0.5 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 ' />
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none '>
               <IoMdSearch className='h6 w-6 text-gray-400' />
              </div>
        </div>
     </form>
  )
}

export default UsuarioBusqueda;
