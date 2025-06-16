import { useState, useEffect } from "react"; 
import axios from 'axios';
import DocenteTabla from "../components/GestionarDocente/DocenteTabla"; //para mostrar la tabla de materiales
import DocenteBusqueda from "../components/GestionarDocente/DocenteBusqueda"; //para buscar materiales
import DocenteModal from "../components/GestionarDocente/DocenteModal"; //para mostrar el modal de agregar material
import { Auth } from "../utils/auth";

const Docentes = () => {
  // Estado para docentes (simulación inicial)
  const [docentes, setDocentes] = useState([
    { id: 1, nombre: "Orlando", apellido: "Moscoso" },
  ]);

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);

  // Función para abrir modal de agregar
  const abrirModalAgregar = () => {
    setModalOpen(true);
  };

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalOpen(false);
  };

  // Simulación de agregar docente nuevo (por ejemplo, puedes cambiarlo por un formulario real luego)
  const agregarDocente = () => {
    const nuevoId = docentes.length + 1;
    const nuevoDocente = { id: nuevoId, nombre: `Nuevo${nuevoId}`, apellido: `Apellido${nuevoId}` };
    setDocentes([...docentes, nuevoDocente]);
    cerrarModal();
  };

  // Función para editar (por ahora solo alert)
  const onEditar = (id) => {
    alert(`Editar docente con id: ${id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Barra de búsqueda y botón */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginRight: 10,
          }}
        />
        <button
          onClick={abrirModalAgregar}
          style={{
            backgroundColor: "#C30000",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Agregar Docente
        </button>
      </div>

      {/* Tabla de docentes */}
      <DocenteTabla docentes={docentes} onEditar={onEditar} />

      {/* Modal simple */}
      {modalOpen && (
        <DocenteModal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            onAgregarDocente={agregarDocente} 
         />
      )}
    </div>
  );
};

export default Docentes;
