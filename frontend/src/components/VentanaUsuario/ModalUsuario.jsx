import React, { useState, useEffect } from 'react';
import { FiX } from "react-icons/fi";

export default function ModalUsuario({ isOpen, onClose, onAgregarUsuario }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(2);

  const agregar = async (e) => {
    e.preventDefault();
    // rellenar campos
    if (!nombre || !apellido || !nombreUsuario || !password) {
      alert("Rellene todos los campos");
      return;
    }
    
    // Convertir el rol a número y validar
   const rolNumero = Number(rol);
    if (![1, 2].includes(rolNumero)) {
      alert("El rol debe ser Administrador (1) o Auxiliar (2).");
     return;
    }
    // Enviar datos al backend
    const registrado= await onAgregarUsuario({ 
     nombre: nombre,
     apellido: apellido,
     nombre_usuario: nombreUsuario,
     password_: password,
     rol: rolNumero 
    });
    if (registrado) {
      onClose();
      // Limpiar campos si lo deseas
      setNombre("");
      setApellido("");
      setNombreUsuario("");
      setPassword("");
      setRol(2);
    }
  };
   
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Registrar Usuario</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">
             <FiX />
          </button>
        </div>

        <form onSubmit={agregar}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input type="text" value={nombre} placeholder="Nombre" className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={(e) => setNombre(e.target.value)}/>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input type="text" value={apellido}  onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="w-full px-3 py-2 border border-gray-300 rounded-md " />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre Usuario</label>
              <input type="text" value={nombreUsuario} placeholder='Nombre Usuario' onChange={(e) => setNombreUsuario(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md " />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input type="password" value={password} placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md "/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select  value={rol}onChange={(e) => setRol(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md " >
                <option value="1">Administrador</option>
                <option value="2">Auxiliar</option>
              </select>
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
              Agregar
            </button>
            </div>
          </div>
        
        </form>
      </div>
    </div>
  );
}
