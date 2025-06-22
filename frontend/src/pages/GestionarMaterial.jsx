import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MaterialTabla from "../components/GestionarMaterial/MaterialTabla"; //para mostrar la tabla de materiales
import MaterialSearchBar from "../components/GestionarMaterial/MaterialSearchBar"; //para buscar materiales
import Modal from "../components/GestionarMaterial/modal"; //para mostrar el modal de agregar material
import { Auth } from "../utils/auth";
import { LuLogOut } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FiPackage } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

export default function GestionarMaterial() {
  // Estados del componente
  const [materiales, setMateriales] = useState([]); //estado para todos los materiales
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]); //estado para materiales filtrados
  const [isLoading, setIsLoading] = useState(false); // estado de carga
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navegar = useNavigate();
 
  // Token de autenticación
  const token = Auth.getToken("token"); // Obtenemos el token 
  useEffect(() => {
  if (!token) {
    navegar("/");
  }
}, [token, navegar]);
  //localStorage sirve para almacenar datos en el navegador, ej token JWT después de iniciar sesion
if (!token)  return null;

  // Función para cargar materiales desde el backend con caching
  const [cacheKey, setCacheKey] = useState(Date.now());
  const cargarMateriales = async (forceRefresh = false) => {
    if (!forceRefresh && materiales.length > 0) {
      // si tenemos materiales y no es necesario refrescar, devolvemos inmediatamente
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/materiales", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data && response.data.success) {
        // Usamos directamente los datos del backend
        setMateriales(response.data.data);
        setMaterialesFiltrados(response.data.data);
        setCacheKey(Date.now()); // Update cache key to force re-render if needed
        setMensaje('Materiales cargados correctamente');
      } else {
        setMateriales([]);
        setMaterialesFiltrados([]);
        setMensaje(response.data?.message || 'No se pudieron cargar los materiales');
      }
    } catch (error) {
      console.error("Error al cargar materiales:", error);
      setMateriales([]);
      setMaterialesFiltrados([]);
      setMensaje(`Error al cargar los materiales: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
   // useEffect para cargar materiales al inicio
  useEffect(() => {
    cargarMateriales();
  }, []);
  // Ocultar mensaje automáticamente después de 1 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);
 
const editarCantidad = async (codigoMaterial, nuevaCantidad) => {
  try {
    const material = materiales.find(m => m.codigo_material === codigoMaterial);
    if (!material || nuevaCantidad < 0) return;

    // Actualizar local
    const materialesActualizados = materiales.map(m =>
      m.codigo_material === codigoMaterial ? { ...m, cantidad_total: nuevaCantidad } : m
    );
    setMateriales(materialesActualizados);
    setMaterialesFiltrados(materialesActualizados);

    // Actualizar en backend
    await axios.put(`http://localhost:4000/api/materiales/${codigoMaterial}`, {
      cantidad_total: nuevaCantidad
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMensaje('Cantidad actualizada');
  } catch (error) {
    console.error('Error al editar cantidad:', error);
    setMensaje('Error al actualizar la cantidad');
  }
};
// Función para agregar material
const AgregarMaterial = async (nuevoMaterial) => {
  try {
    const token = Auth.getToken();
    if (!token) {
      setMensaje('No hay sesión activa');
      return false;
    }

    const response = await axios.post(
      "http://localhost:4000/api/materiales",
      nuevoMaterial,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (response.data.success) {
      // Actualizar localmente con el nuevo material
      const nuevoMaterialActualizado = {
        ...nuevoMaterial,
        id: response.data.data.id, // Usar el ID que devuelve el backend
        cantidad_total: nuevoMaterial.cantidad // Aseguramos que la cantidad se muestre correctamente
      };
      
      // Actualizar el estado
      const nuevosMateriales = [...materiales, nuevoMaterialActualizado];
      setMateriales(nuevosMateriales);
      setMaterialesFiltrados(nuevosMateriales);
      
      setMensaje('Material agregado correctamente');
      return true;
    } else {
      setMensaje(response.data.message || 'Error al agregar material');
      return false;
    }
  } catch (error) {
    console.error("Error al agregar material:", error);
    setMensaje(`Error al agregar material: ${error.response?.data?.message || error.message}`);
    return false;
  }
};

  // Función para manejar la búsqueda
   const manejarBusqueda = (terminoBusqueda) => {
     if (terminoBusqueda.trim() === "") {
       setMaterialesFiltrados(materiales);
     } else {
       const filtrados = materiales.filter(material =>
         material.codigo_material.toString().includes(terminoBusqueda) ||
         material.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
       );
       setMaterialesFiltrados(filtrados);
     }
   };

return (
  <div className="min-h-screen bg-white">
    {/* Header superior */}
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
  const rol = localStorage.getItem("rol");
  if (rol === "Administrativo") {
    navegar("/menu-admin");
  } else {
    navegar("/menu-aux");
  }
}}
            className="flex items-center gap-2 text-red-600 hover:text-red-900 font-semibold"
          >
            <IoArrowBackCircleOutline className="w-6 h-6" />
            Volver al Menú
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navegar("/");
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <LuLogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    {/* Contenido principal */}
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-xl">
            <FiPackage className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lista de Materiales
            </h1>
          </div>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <MaterialSearchBar onBuscar={manejarBusqueda} />
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >  <FiPlus className="w-5 h-5" />
            Agregar Material
          </button>
        </div>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div
          className={`p-4 mb-4 rounded-md ${
            mensaje.includes("error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {mensaje}
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        </div>
      )}

      {/* Tabla de materiales */}
      <MaterialTabla
        materiales={materialesFiltrados}
        onEditarCantidad={editarCantidad}
      />
    </div>

    {/* Modal */}
    <Modal
      isOpen={modalAbierto}
      onClose={() => setModalAbierto(false)}
      onAgregarMaterial={AgregarMaterial}
    />
  </div>
);
}