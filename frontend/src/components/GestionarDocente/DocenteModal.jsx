import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { FiX } from "react-icons/fi";
export default function Modal({isOpen, onClose, onAgregarDocente, docenteEditar, onEditarDocente}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [estado, setEstado] = useState(1); // 1 = activo, 0 = inactivo
  const [errorEstado, setErrorEstado] = useState("");

  useEffect(() => {
    if (docenteEditar) {
      setNombre(docenteEditar.persona?.nombre || "");
      setApellido(docenteEditar.persona?.apellido || "");
      setEstado(
        docenteEditar.estado === 1 || docenteEditar.estado === true
          ? 1
          : docenteEditar.estado === 0 || docenteEditar.estado === false
          ? 0
          : ""
      );
    } else {
      setNombre("");
      setApellido("");
      setEstado("");
    }
    setErrorEstado("");
  }, [docenteEditar, isOpen]);

  const guardar = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('Por favor, ingrese un nombre');
      return;
    }
    if (!apellido.trim()) {
      alert('Por favor, ingrese un apellido');
      return;
    }
    if (estado === "" || estado === null) {
      setErrorEstado("Por favor, seleccione el estado.");
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      estado: Number(estado) // Asegura que sea 0 o 1
    };

    if (docenteEditar) {
      onEditarDocente({ ...datos, id_docente: docenteEditar.id_docente });
    } else {
      onAgregarDocente(datos);
    }

    setNombre("");
    setApellido("");
    setEstado("");
    setErrorEstado("");
    onClose();
  };

  if(!isOpen) return null;

  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl "> 
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {docenteEditar ? "Editar Docente" : "Registrar Docente"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">
            <FiX />
          </button>
        </div>
        <form onSubmit={guardar} className="space-y-4 ">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre: </label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Apellido: </label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Estado: </label>
            <select className="w-full px-4 py-2 border rounded-md" value={estado} onChange={e => { setEstado(e.target.value); setErrorEstado(""); }}>
              <option value="">Seleccione estado</option>
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
            {errorEstado && (
              <div className="text-red-600 text-xs mt-1">{errorEstado}</div>
            )}
          </div>
          <div className='flex gap-x-6 gap-y-5 pt-4'>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>

            <Button
              type="submit"
              variant="red"
              className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              {docenteEditar ? "Editar" : "Guardar"}
            </Button>
            
          </div>
        </form>
      </div>
    </div>
  );
}