import { useState } from 'react';
import { FiX } from "react-icons/fi";
export default function MateriaModal({ isOpen, onClose, onAgregarMateria, carrera }) {
  const [materia, setMateria] = useState({ nombre: "", id_carrera: "" });

  const agregar = (e) => {
    e.preventDefault();

    // Validar campos
    if (!materia.nombre.trim()) {
      alert('Por favor, ingrese una materia');
      return;
    }
    if (!materia.id_carrera) {
      alert("Seleccione una carrera");
      return;
    }

    // Enviar al backend
    onAgregarMateria({
      nombre: materia.nombre.trim(),
      id_carrera: parseInt(materia.id_carrera)
    });

    // Limpiar campos y cerrar modal
    setMateria({ nombre: "", id_carrera: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Registrar Materia</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">
             <FiX />
          </button>
        </div>

        <form onSubmit={agregar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la materia</label>
            <input
              type="text"
              value={materia.nombre}
              onChange={(e) => setMateria({ ...materia, nombre: e.target.value })}
              placeholder="Materia"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
            <select
              value={materia.id_carrera}
              onChange={(e) => setMateria({ ...materia, id_carrera: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Seleccione una opción</option>
              {carrera.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.nombre}
                </option>
              ))}
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
        </form>
      </div>
    </div>
  );
}


       