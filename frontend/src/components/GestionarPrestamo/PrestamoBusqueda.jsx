import React, { useState } from 'react';
import { IoMdSearch } from "react-icons/io";

const PrestamoBusqueda = ({ onBuscar, placeholder = 'Buscar...' }) => {
  const [busqueda, setBusqueda] = useState("");

  const handleSearch = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    onBuscar(valor);
  };

  return (
    <form className="w-full max-w-xl mb-6" onSubmit={(e) => e.preventDefault()}>
      <div className='relative'>
        <input 
          type="search" 
          placeholder={placeholder}
          value={busqueda} 
          onChange={handleSearch} 
          className='w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500' 
        />
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <IoMdSearch className='h-5 w-5 text-gray-400' />
        </div>
      </div>
    </form>
  );
};

export default PrestamoBusqueda;
