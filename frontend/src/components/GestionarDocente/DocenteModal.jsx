import React, { useState } from 'react';

export default function Modal({isOpen, onClose, onAgregarDocente}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const agregar = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!nombre.trim()) {
      alert('Por favor, ingrese un nombre');
      return;
    }
    if (!apellido.trim()) {
      alert('Por favor, ingrese un apellido');
      return;
    }

    // Enviar datos al backend
    onAgregarDocente({ 
      nombre: nombre.trim(),
      apellido: apellido.trim()
    });

    // Limpiar campos y cerrar modal
    setNombre("");
    setApellido("");
    onClose();
  };

  if(!isOpen) return null;

  return(
    //fondo oscuro fuera del modal, inset oculta todo el contenido de la pantalla
  <div className=" fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
    
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4"> 
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Registrar Docente </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>
      
        <form onSubmit={agregar} className="space-y-4 ">

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1' >Nombre: </label>
            <input type="text" value={nombre}  onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-2 border rounded-md" />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1' >Apellido: </label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" required className="w-full px-4 py-2 border rounded-md" />
          </div>
        <div className='flex justify-center'>
          <button type="submit" className="w-1/2 py-2 text-white font-semibold rounded-md " style={{ backgroundColor: "var(--color-primary)" }}>
            Guardar
          </button>
        </div>
          
        </form>
      </div>
  </div>
  );
}

       
