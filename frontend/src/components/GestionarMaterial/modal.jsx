import React, { useState, useRef, useEffect } from 'react';

export default function Modal({isOpen, onClose, onAgregarMaterial}) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
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
      // Aquí podrías hacer una búsqueda automática del nombre si tienes una API para eso
      // Por ahora, solo guardamos el código
      setCodigo(e.target.value);
      // Enfocar el input del nombre
      document.getElementById('nombreInput')?.focus();
    }
  };

  const agregar = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (!codigo || !nombre) {
      alert('Por favor, ingrese código y nombre');
      return;
    }

    // Validar cantidad
    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('Por favor, ingrese una cantidad válida (número mayor a 0)');
      return;
    }

    // Enviar datos al backend
    onAgregarMaterial({ 
      codigo_material: codigo,
      nombre,
      cantidad: cantidadNum
    });

    // Limpiar campos y cerrar modal
    setCodigo("");
    setNombre("");
    setCantidad("");
    onClose();
  };

  if(!isOpen) return null;

  return(
    //fondo oscuro fuera del modal, inset oculta todo el contenido de la pantalla
  <div className=" fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
    
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4"> 
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AGREGAR MATERIAL</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>
      
        <form onSubmit={agregar} className="space-y-4 ">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Codigo de barra</label>
            <input type="text" value={codigo}  placeholder="Codigo de barra" required className="w-full px-4 py-2 border rounded-md" onChange={(e) => setCodigo(e.target.value)} />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1' >Nombre del Material</label>
            <input type="text" value={nombre}  onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-2 border rounded-md" />
          </div>

          <div>
            <label className=' block text-sm font-medium text-gray-700 mb-1'>Cantidad</label>
            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" required min="1" className="w-full px-4 py-2 border rounded-md" />
          </div>
        <div className='flex justify-center'>
          <button type="submit" className="w-1/2 py-2 text-white font-semibold rounded-md " style={{ backgroundColor: "var(--color-primary)" }}>
            AGREGAR
          </button>
        </div>
          
        </form>
      </div>
  </div>
  );
}

       

