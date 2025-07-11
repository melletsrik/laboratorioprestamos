import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { FiX } from "react-icons/fi";

export default function Modal({
  isOpen, 
  onClose, 
  onAgregarEstudiante,
  estudianteEditar,
  onEditarEstudiante,
  mensaje,           // <-- Agrega esto
  setMensaje 
}) {
  const [registro, setRegistro] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  // Cargar datos si es edición
  useEffect(() => {
    if (estudianteEditar) {
      setRegistro(estudianteEditar.registro || estudianteEditar.Registro || "");
      setNombre(estudianteEditar.nombre || estudianteEditar.persona?.nombre || "");
      setApellido(estudianteEditar.apellido || estudianteEditar.persona?.apellido || "");
    } else {
      setRegistro("");
      setNombre("");
      setApellido("");
    }
  }, [estudianteEditar, isOpen]);

  const guardar = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z0-9]{6}$/.test(registro)) {
      alert('Por favor, ingrese un registro válido de 6 dígitos');
      return;
    }
    if (!nombre.trim()) {
      alert('Por favor, ingrese un nombre');
      return;
    }
    if (!apellido.trim()) {
      alert('Por favor, ingrese un apellido');
      return;
    }

    const datos = {
      registro: registro,
      nombre: nombre.trim(),
      apellido: apellido.trim()
    };

    try {
      let exito = false;
      if (estudianteEditar) {
        exito = await onEditarEstudiante({ ...datos, id_estudiante: estudianteEditar.id_estudiante });
      } else {
        exito = await onAgregarEstudiante(datos);
      }

      if (exito) {
        // Limpiar campos y cerrar modal
        setRegistro("");
        setNombre("");
        setApellido("");
        onClose();
      }
    } catch (error) {
      console.error('Error al registrar/editar estudiante:', error);
      if (setMensaje) {
        setMensaje('Error al registrar/editar estudiante. Por favor, inténtelo de nuevo.');
      }
    }
  };

  if(!isOpen) return null;

  return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"> 
       <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"> 
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {estudianteEditar ? "Editar Estudiante" : "Registrar Estudiante"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
           <FiX />
          </button>
        </div>
        <form onSubmit={guardar} className="space-y-4 ">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Registro </label>
            <input type="int" value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="Registro" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Nombre </label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Apellido </label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className="flex gap-x-6 gap-y-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}