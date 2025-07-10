import React, { useState, useEffect } from 'react';
import { FiX } from "react-icons/fi";

// Constantes de roles
const ROLES = {
  ADMINISTRATIVO: 1,
  AUXILIAR: 2
};

export default function ModalUsuario({ isOpen, onClose, onAgregarUsuario, onEditarUsuario, usuarioEditando }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(ROLES.AUXILIAR);

  // Limpiar campos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setApellido("");
      setNombreUsuario("");
      setPassword("");
      setRol(ROLES.AUXILIAR);
    }
  }, [isOpen]);

  useEffect(() => {
    if (usuarioEditando) {
      // Si es edición, prellenar los campos con los datos del usuario
      setNombre(usuarioEditando.nombre);
      setApellido(usuarioEditando.apellido);
      setNombreUsuario(usuarioEditando.nombre_usuario);
      // Obtener el ID del rol del objeto rol
      setRol(usuarioEditando.rol?.id_rol || 2);
    } else {
      // Si no es edición, limpiar campos
      setNombre("");
      setApellido("");
      setNombreUsuario("");
      setPassword("");
      setRol(ROLES.AUXILIAR);
    }
  }, [usuarioEditando]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosUsuario = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nombre_usuario: nombreUsuario.trim(),
      password_: password.trim(),
      id_rol: Number(rol),
      estado: true
    };

    try {
      if (usuarioEditando) {
        // Si es edición
        if (typeof onEditarUsuario === 'function') {
          const resultado = await onEditarUsuario(usuarioEditando.id_usuario, datosUsuario);
          if (resultado) {
            onClose();
          }
        }
      } else {
        // Si es creación
        if (typeof onAgregarUsuario === 'function') {
          const resultado = await onAgregarUsuario(datosUsuario);
          if (resultado) {
            onClose();
          }
        }
      }
    } catch (error) {
      console.error("Error al procesar usuario:", error);
      alert('Error: No se pudo procesar la solicitud');
    }
  };

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{usuarioEditando ? 'Editar Usuario' : 'Registrar Usuario'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">
             <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input type="text" value={nombre} placeholder="Nombre" className="w-full px-3 py-2 border border-gray-300 rounded-md" onChange={(e) => setNombre(e.target.value)}
                disabled={usuarioEditando}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input type="text" value={apellido}  onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="w-full px-3 py-2 border border-gray-300 rounded-md " 
                disabled={usuarioEditando}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de Usuario</label>
              <input type="text" value={nombreUsuario}  onChange={(e) => setNombreUsuario(e.target.value)} placeholder="Nombre de Usuario" className="w-full px-3 py-2 border border-gray-300 rounded-md " 
                disabled={usuarioEditando}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select value={rol} onChange={(e) => setRol(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value={ROLES.AUXILIAR}>Auxiliar</option>
                <option value={ROLES.ADMINISTRATIVO}>Administrativo</option>
              </select>
            </div>

            {usuarioEditando ? null : (
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input type="password" value={password}  onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            )}

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
              {usuarioEditando ? 'Guardar' : 'Agregar'}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
