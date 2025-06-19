import { useState, useEffect } from "react"; 
import axios from 'axios';
import UsuarioTabla from "../components/VentanaUsuario/UsuarioTabla"; //para mostrar la tabla de usuarios
import UsuarioSearchBar from "../components/VentanaUsuario/UsuarioSearchBar"; //para buscar usuarios
import ModalUsuario from "../components/VentanaUsuario/ModalUsuario"; //para mostrar el modal de agregar usuario
import { Auth } from "../utils/auth";

export default function VentanaUsuario() {
  const [usuario, setUsuario] = useState([]); //estado para todos los 
  const [usuarioFiltrados, setUsuarioFiltrados] = useState([]); //estado para 
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

 // Función para cargar auxiliares desde el backend
 const cargarUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/auxiliares", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data && response.data.success) {
        // Usamos directamente los datos del backend
        setUsuario(response.data.data);
        setUsuarioFiltrados(response.data.data);
        setMensaje('Usuarios cargados correctamente');
      } else {
        setUsuario([]);
        setUsuarioFiltrados([]);
        setMensaje(response.data?.message || 'No se pudieron cargar los usuarios');
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuario([]);
      setUsuarioFiltrados([]);
      setMensaje(`Error al cargar los usuario: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // useEffect para cargar materiales al inicio
  useEffect(() => {
    cargarUsuarios();
  }, []);
  // Función para agregar usuario desdr modal
const AgregarUsuario = async (nuevoUsuario) => {
  try {
    const token = Auth.getToken();
    if (!token) {
      setMensaje('No hay sesión activa');
      return;
    }

    const response = await axios.post(
      "http://localhost:4000/api/auxiliares",
      nuevoUsuario,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (response.data.success) {
      // Refrescar la lista de usuarios
      await cargarUsuarios();
      setMensaje('Usuario agregado correctamente');
      return true;
    } else {
      setMensaje(response.data.message || 'Error al agregar usuario');
      return false;
    }
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    setMensaje(`Error al agregar usuario: ${error.response?.data?.message || error.message}`);
    return false;
  }
};
// Función para cambiar el estado del usuario
const cambiarEstado = async (idUsuario, nuevoEstado) => {
  try {
    const token = Auth.getToken();
    if (!token) {
      setMensaje('No hay sesión activa');
      return;
    }
//lo q espera del backend
    const response = await axios.put(`http://localhost:4000/api/auxiliares/${idUsuario}/estado`,
      { estado: nuevoEstado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (response.data.success) {
      await cargarUsuarios();
      setMensaje(`Usuario ${nuevoEstado ? 'habilitado' : 'deshabilitado'} correctamente`);
      return true;
    } else {
      setMensaje(response.data.message || 'Error al cambiar estado');
      return false;
    }
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    setMensaje(`Error al cambiar estado: ${error.response?.data?.message || error.message}`);
    return false;
  }
};
// Función para manejar la búsqueda
   const manejarBusqueda = (terminoBusqueda) => {
     if (terminoBusqueda.trim() === "") {
       setUsuarioFiltrados(usuario);
     } else {
       const filtrados = usuario.filter(usuario =>
         usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
       );
       setUsuarioFiltrados(filtrados);
     }
   };

return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
        
        {/* Barra de búsqueda y botón agregar */}
        <div className="flex justify-between items-center mb-4">
          <UsuarioSearchBar onBuscar={manejarBusqueda} />
          <button onClick={() => setModalAbierto(true)} className="bg-red-700 hover:bg-red-750 text-white px-6 py-2 rounded-md font-semibold transition-colors">
            Agregar Usuario
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
      <UsuarioTabla  usuarios={usuarioFiltrados} onCambiarEstado={cambiarEstado}/>

      {/* Modal */}
      <ModalUsuario isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onAgregarUsuario={AgregarUsuario} />
    </div>
  );
}