import { useState } from 'react';
import { IoMdSearch } from "react-icons/io";

export default function MateriaBusqueda({ onBuscar }) {
  const [busqueda, setBusqueda] = useState(""); // Estado para almacenar la búsqueda
  const handleBusqueda = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    onBuscar(valor); // Llama a la función del padre para filtrar resultados
  };
  return (
    <form className="w-full max-w-xl">
      <div className="relative">
        <input
          type="search"
          placeholder="Buscar..."
          value={busqueda}
          onChange={handleBusqueda}
          className="w-full pl-10 pr-4 py-0.5 border border-gray-400 rounded-lg focus:outline-none focus:ring-1"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoMdSearch className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </form>
  );
}
