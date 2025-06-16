import React, { useState } from 'react';
import { IoMdSearch } from "react-icons/io";
const DocenteBusqueda = ({ onBuscar }) => {
    const [busqueda, setBusqueda]= useState("");

    const handleSearch = (e) => {//handle es Buscar y hace referencia a la funcion que se ejecuta al cambiar el input
        const valor= e.target.value; 
        setBusqueda(valor); //guarda el valor del input
        onBuscar(valor);//le digo al padre q filtrar
    };
    return(
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
export default DocenteBusqueda;