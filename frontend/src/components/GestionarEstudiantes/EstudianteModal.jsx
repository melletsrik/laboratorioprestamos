import React, { useState, useEffect } from 'react';
import Button from '../Button';

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

    let exito = false;
    if (estudianteEditar) {
      exito = await onEditarEstudiante({ ...datos, id_estudiante: estudianteEditar.id_estudiante });
    } else {
      exito = await onAgregarEstudiante(datos);
    }
    if (exito) {
      setRegistro("");
      setNombre("");
      setApellido("");
      onClose();
    }
  };

  if(!isOpen) return null;

  return(
      <div className="fixed inset-0 bg-gray-200 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4"> 
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {estudianteEditar ? "Editar Estudiante" : "Registrar Estudiante"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>
        <form onSubmit={guardar} className="space-y-4 ">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Registro: </label>
            <input type="int" value={registro} onChange={(e) => setRegistro(e.target.value)} placeholder="Registro" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre: </label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Apellido: </label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" required className="w-full px-4 py-2 border rounded-md" />
          </div>
          <div className='flex justify-center'>
            <Button
              type="submit"
              variant="red"
              className="w-1/2 py-2 text-white font-semibold rounded-md"
            >
              {estudianteEditar ? "Editar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}