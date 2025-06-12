import { useState, useEffect } from "react"; 
import axios from "axios"; 
import MaterialTabla from "../components/GestionarMaterial/MaterialTabla"; //para mostrar la tabla de materiales
import MaterialSearchBar from "../components/GestionarMaterial/MaterialSearchBar"; //para buscar materiales
import Modal from "../components/GestionarMaterial/modal"; //para mostrar el modal de agregar material

export default function GestionarMaterial() {
  const [materiales, setMateriales] = useState([]);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

const TOKEN = "AQUÍ_VA_TU_TOKEN_JWT";

 const cargarMateriales = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/materiales", {//la api funciona como un intermediario
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      setMateriales(response.data);
    } catch (error) {
      console.error("Error al cargar materiales:", error);
    }
  };
// Cargar al inicio
useEffect(() => {
  cargarMateriales();
}, []);

  // Actualizar materiales filtrados cuando cambian los materiales
  useEffect(() => {
    setMaterialesFiltrados(materiales);
  }, [materiales]);

  // Función para agregar material
  const AgregarMaterial = async (nuevoMaterial) => {
    try {
      await axios.post("http://localhost:4000/api/materiales", {
        codigo_material: nuevoMaterial.codigo,
        nombre_material: nuevoMaterial.nombre,
        cantidad: nuevoMaterial.cantidad
      }, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },

      },);
      await cargarMateriales(); // Recargar materiales desde el backend
      setModalAbierto(false);
      setMensaje("Material agregado correctamente");
    } catch (error) {
      console.error("Error al agregar material:", error);
      setMensaje("error al agregar el material");
    }
  };
 // Función para manejar la búsqueda
  const manejarBusqueda = (terminoBusqueda) => {
    if (terminoBusqueda.trim() === "") {
      setMaterialesFiltrados(materiales);
    } else {
      const filtrados = materiales.filter(material =>
        material.codigo.toString().includes(terminoBusqueda) ||
        material.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setMaterialesFiltrados(filtrados);
    }
  };

  // Función para aumentar cantidad
  const aumentarCantidad = (id) => {
    const materialesActualizados = materiales.map(material =>
      material.id === id 
        ? { ...material, cantidad: material.cantidad + 1 }
        : material
    );
    setMateriales(materialesActualizados);
  };

  // Función para disminuir cantidad
  const disminuirCantidad = (id) => {
    const materialesActualizados = materiales.map(material =>
      material.id === id && material.cantidad > 0
        ? { ...material, cantidad: material.cantidad - 1 }
        : material
    );
    setMateriales(materialesActualizados);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Materiales</h1>
        
        {/* Barra de búsqueda y botón agregar */}
        <div className="flex justify-between items-center mb-4">
          <MaterialSearchBar onBuscar={manejarBusqueda} />
          <button onClick={() => setModalAbierto(true)} className="bg-red-700 hover:bg-red-750 text-white px-6 py-2 rounded-md font-semibold transition-colors">
            Agregar Material
          </button>
        </div>
      </div>

      {/* Tabla de materiales */}
      <MaterialTabla materiales={materialesFiltrados} onAumentar={aumentarCantidad} onDisminuir={disminuirCantidad}/>

      {/* Modal */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onAgregarMaterial={AgregarMaterial} />
    </div>
  );
}