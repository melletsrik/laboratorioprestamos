import React, { useState, useRef, useEffect } from 'react';
import { FiX } from "react-icons/fi";

export default function Modal({isOpen, onClose, onAgregarMaterial}) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const inputRef = useRef(null);

  // useEffect para enfocar automáticamente el input de código cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Manejar la entrada del lector de código de barras
  const handleCodigo = (e) => {
    // Si es Enter (código de barras terminado) o el input ya tiene el código completo
    if (e.key === 'Enter' || e.target.value.length >= 13) { // 13 es el típico largo de un código EAN-13
      e.preventDefault();
      // Si ya hay un código, no permitir leer otro
      if (codigo) return;
      
      // Aquí podrías hacer una búsqueda automática del nombre si tienes una API para eso
      // Por ahora, solo guardamos el código
      setCodigo(e.target.value);
      // Enfocar el input del nombre
      document.getElementById('nombreInput')?.focus();
    }
  };

  // Evitar que el código de barras se lea en otros campos
  const handleInput = (e) => {
    // Si el input tiene más de 12 caracteres (indicando que podría ser un código de barras)
    if (e.target.value.length > 12) {
      // Solo permitir en el campo de código
      if (e.target.name !== 'codigo') {
        e.preventDefault();
        return false;
      }
    }
    return true;
  };

  const agregar = async (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!codigo || !nombre) {
      alert('Por favor, ingrese código y nombre');
      return;
    }

    // Validar cantidad
    const cantidadNum = Number(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('Por favor, ingrese una cantidad válida (número mayor a 0)');
      return;
    }
    try {
      const registrado = await onAgregarMaterial({ 
        codigo_material: codigo,
        nombre,
        cantidad: cantidadNum
      });

      if (registrado) {
        onClose();
        setCodigo("");
        setNombre("");
        setCantidad("");
      }
    } catch (error) {
      console.error('Error al agregar material:', error);
      alert('Error al agregar el material. Por favor, inténtelo de nuevo.');
    }
};

  if(!isOpen) return null;

  return(
    //fondo oscuro fuera del modal, inset oculta todo el contenido de la pantalla
  <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl "> 
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">AGREGAR MATERIAL</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">
            <FiX />
          </button>
        </div>
      
        <form onSubmit={agregar} className="space-y-4 ">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Codigo de barra</label>
            <input 
            type="text" 
            name="codigo"
            value={codigo}  
            placeholder="Codigo de barra" 
            required 
            className="w-full px-4 py-2 border border-gray-500 rounded-md  " 
            onChange={(e) => {
              if (handleInput(e)) {
                setCodigo(e.target.value);
              }
            }}
            onKeyDown={handleCodigo}
            ref={inputRef}
          />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2' >Nombre del Material</label>
            <input 
            type="text" 
            name="nombre"
            value={nombre}  
            onChange={(e) => {
              if (handleInput(e)) {
                setNombre(e.target.value);
              }
            }}
            placeholder="Nombre" 
            required 
            className="w-full px-4 py-2 border rounded-md rounded-gray-500"
          />
          </div>

          <div>
            <label className=' block text-sm font-medium text-gray-700 mb-2'>Cantidad</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" required min="1" className="w-full px-4 py-2 border rounded-md rounded-gray-500" />
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
          
        </form>
      </div>
  </div>
  );
}     

