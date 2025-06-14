import { useState, useEffect } from "react"; 
import axios from 'axios';
import MaterialTabla from "../components/GestionarMaterial/MaterialTabla"; //para mostrar la tabla de materiales
import MaterialSearchBar from "../components/GestionarMaterial/MaterialSearchBar"; //para buscar materiales
import Modal from "../components/GestionarMaterial/modal"; //para mostrar el modal de agregar material
import { Auth } from "../utils/auth";

export default function GestionarMaterial() {
  // Estados del componente
  const [materiales, setMateriales] = useState([]); //estado para todos los materiales
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]); //estado para materiales filtrados
  const [isLoading, setIsLoading] = useState(false); // estado de carga
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Token de autenticación
  const token = Auth.getToken("token"); // Obtenemos el token 
  //localStorage sirve para almacenar datos en el navegador, ej token JWT después de iniciar sesion
  if (!token) {
      setMensaje('No hay sesión activa');
      return null;
    }

 // Función para cargar materiales desde el backend
  const cargarMateriales = async () => {
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

 
 // Función para aumentar cantidad
const aumentarCantidad = async (codigoMaterial) => {
  try {
    const material = materiales.find(m => m.codigo_material === codigoMaterial);
    if (!material) return;

    // Actualizar localmente
    const materialesActualizados = materiales.map(m =>
      m.codigo_material === codigoMaterial ? { ...m, cantidad_total: m.cantidad_total + 1 } : m
    );
    setMateriales(materialesActualizados);
    setMaterialesFiltrados(materialesActualizados);

    // Actualizar en el backend
    await axios.put(`http://localhost:4000/api/materiales/${codigoMaterial}`, {
      cantidad_total: material.cantidad_total + 1
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.error('Error al aumentar cantidad:', error);
    setMensaje('Error al actualizar la cantidad');
  }
};

// Función para disminuir cantidad
const disminuirCantidad = async (codigoMaterial) => {
  try {
    const material = materiales.find(m => m.codigo_material === codigoMaterial);
    if (!material || material.cantidad_total <= 0) return;

    // Actualizar localmente
    const materialesActualizados = materiales.map(m =>
      m.codigo_material === codigoMaterial ? { ...m, cantidad_total: m.cantidad_total - 1 } : m
    );
    setMateriales(materialesActualizados);
    setMaterialesFiltrados(materialesActualizados);

    // Actualizar en el backend
    await axios.put(`http://localhost:4000/api/materiales/${codigoMaterial}`, {
      cantidad_total: material.cantidad_total - 1
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.error('Error al disminuir cantidad:', error);
    setMensaje('Error al actualizar la cantidad');
  }
};

  // useEffect para verificar los materiales tabla material
  useEffect(() => {
    console.log('Materiales:', materiales);
    console.log('Materiales filtrados:', materialesFiltrados);
  }, [materiales, materialesFiltrados]);

  
// Función para agregar material
const AgregarMaterial = async (nuevoMaterial) => {
  try {
    const token = Auth.getToken();
    if (!token) {
      setMensaje('No hay sesión activa');
      return;
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
      // Refrescar la lista de materiales
      cargarMateriales();
      setMensaje('Material agregado correctamente');
    } else {
      setMensaje(response.data.message || 'Error al agregar material');
    }
  } catch (error) {
    console.error("Error al agregar material:", error);
    setMensaje(`Error al agregar material: ${error.response?.data?.message || error.message}`);
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

      {/* Mensaje */}
      {mensaje && (
        <div className={`p-4 mb-4 rounded-md ${mensaje.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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
        onAumentar={aumentarCantidad}
        onDisminuir={disminuirCantidad}
      />

      {/* Modal */}
      <Modal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onAgregarMaterial={AgregarMaterial} />
    </div>
  );

}