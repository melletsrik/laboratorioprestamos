import React, { useState } from 'react';
import { IoMdSearch } from "react-icons/io";

const MaterialSearchBar = ({ onBuscar }) => {
    const [busqueda, setBusqueda]= useState("");

    const handleSearch = (e) => {//handle es Buscar y hace referencia a la funcion que se ejecuta al cambiar el input
        const valor= e.target.value; 
        setBusqueda(valor); //guarda el valor del input
        onBuscar(valor);//le digo al padre q filtrar
    };
    return(
        <form className="w-full max-w-lvh ">
            <div className='relative bg-gray-30'>
                 {/* dentro de buscar y los bordes , py= padding de alto*/}
                <input type="Search" placeholder='Buscar por codigo o nombre..' value={busqueda} onChange={handleSearch} className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 ' />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none '>
                    <IoMdSearch className='h6 w-6 text-gray-500' />
                </div>
            </div>
        </form>
    )
}
export default MaterialSearchBar;