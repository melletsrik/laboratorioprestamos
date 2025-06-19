import React, { useState, useEffect } from 'react';
import Button from '../Button';

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
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4"> 
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {docenteEditar ? "Editar Docente" : "Registrar Docente"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
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
            <select value={estado} onChange={e => { setEstado(e.target.value); setErrorEstado(""); }}>
              <option value="">Seleccione estado</option>
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
            {errorEstado && (
              <div className="text-red-600 text-xs mt-1">{errorEstado}</div>
            )}
          </div>
          <div className='flex justify-center'>
            <Button
              type="submit"
              variant="red"
              className="w-1/2 py-2 text-white font-semibold rounded-md"
            >
              {docenteEditar ? "Editar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}