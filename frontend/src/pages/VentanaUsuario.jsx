import { useState, useEffect } from "react"; 
import axios from 'axios';
import { Auth } from '../utils/auth';
import UsuarioTabla from "../components/VentanaUsuario/UsuarioTabla"; //para mostrar la tabla de usuarios
import UsuarioSearchBar from "../components/VentanaUsuario/UsuarioSearchBar"; //para buscar usuarios
import ModalUsuario from "../components/VentanaUsuario/ModalUsuario"; //para mostrar el modal de agregar usuario
import { LuLogOut } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; 
import { LuUserCheck } from "react-icons/lu";
export default function VentanaUsuario() {
  const [usuario, setUsuario] = useState([]); //estado para todos los 
  const [usuarioFiltrados, setUsuarioFiltrados] = useState([]); //estado para 
  const [usuarioEditando, setUsuarioEditando] = useState(null); //estado para 
  const [isLoading, setIsLoading] = useState(false); // estado de carga
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
const navegar = useNavigate();
const token = Auth.getToken();
const rol = Auth.getRol(); 
  useEffect(() => {
    if (!token) {
      navegar("/");
    }
  }, [token, navegar]);

  
 // Función para cargar usuarios desde el backend
 const cargarUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/usuarios", {
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
    // Ocultar mensaje automáticamente después de 1 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);
  // Función para agregar usuario desdr modal
  const AgregarUsuario = async (nuevoUsuario) => {
    try {
      const token = Auth.getToken();
      if (!token) {
        setMensaje('No hay sesión activa');
        return false;
      }

      // Log the incoming data for debugging
      console.log("Datos recibidos del formulario:", nuevoUsuario);

        // Validate required fields - use 'password_' and 'id_rol' to match the form field names
        const camposRequeridos = ['nombre', 'apellido', 'nombre_usuario', 'password_', 'id_rol'];
        const camposFaltantes = camposRequeridos.filter(campo => {
          const value = nuevoUsuario[campo];
          return value === undefined || value === null || value === '';
        });


        if (camposFaltantes.length > 0) {
          const mensajeError = `Faltan campos requeridos: ${camposFaltantes.join(', ')}`;
          console.error(mensajeError);
          setMensaje(mensajeError);
          return false;
        }


      // Update the datosUsuario object to use the correct field names
      const datosUsuario = {
        nombre: String(nuevoUsuario.nombre || '').trim(),
        apellido: String(nuevoUsuario.apellido || '').trim(),
        nombre_usuario: String(nuevoUsuario.nombre_usuario || '').trim(),
        password_: nuevoUsuario.password_?.trim() || '',
        id_rol: Number(nuevoUsuario.id_rol),  // Use id_rol directly and ensure it's a number
        estado: Boolean(nuevoUsuario.estado)
      };

        console.log("Datos a enviar al servidor:", JSON.stringify(datosUsuario, null, 2));

        // Make the API call
        const response = await axios({
          method: 'post',
          url: 'http://localhost:4000/api/usuarios',
          data: {
            ...datosUsuario,
            rol_usuario: rol // Agregar el rol del usuario que hace la petición
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        });

        console.log("Respuesta del servidor:", response.data);

        if (response.status === 201 || response.data.success) {
          await cargarUsuarios();
          setMensaje('Usuario agregado correctamente');
          return true;
        } else {
          const errorMsg = response.data?.message || 
                          response.data?.error || 
                          'Error desconocido al agregar usuario';
          console.error("Error del servidor:", errorMsg);
          setMensaje(`Error: ${errorMsg}`);
          return false;
        }
      } catch (error) {
        console.error("Error en AgregarUsuario:", error);
        
        let errorMessage = 'Error al procesar la solicitud';
        if (error.response) {
          // Server responded with a status code outside 2xx
          console.error("Datos del error:", error.response.data);
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
          // Request was made but no response received
          console.error("No se recibió respuesta del servidor:", error.request);
          errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
        } else {
          // Something happened in setting up the request
          console.error("Error en la configuración de la petición:", error.message);
          errorMessage = `Error: ${error.message}`;
        }
        
        setMensaje(errorMessage);
        return false;
      }
    };
  // Función para editar usuario
  const editarUsuario = async (idUsuario, datosUsuario) => {
    // Verificar permisos antes de hacer la petición
    if (!Auth.canChangeRole()) {
      setMensaje('No tienes permisos para cambiar roles');
      return false;
    }

    try {
      const token = Auth.getToken();
      if (!token) {
        setMensaje('No hay sesión activa');
        return false;
      }

      const response = await axios.put(`http://localhost:4000/api/usuarios/${idUsuario}/rol`, {
        id_rol: datosUsuario.id_rol
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        await cargarUsuarios();
        setMensaje('Rol actualizado correctamente');
        return true;
      } else {
        setMensaje(response.data.message || 'Error al actualizar el rol');
        return false;
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
      setMensaje(`Error al editar usuario: ${error.response?.data?.message || error.message}`);
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
    const response = await axios.put(`http://localhost:4000/api/usuarios/${idUsuario}/estado`,
      { estado: nuevoEstado },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
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
         usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
         usuario.nombre_usuario.toLowerCase().includes(terminoBusqueda.toLowerCase())
       );
       setUsuarioFiltrados(filtrados);
     }
   };

return (
  <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navegar("/menu-admin")}
              className="flex items-center gap-2 text-red-600 hover:text-red-900 font-semibold"
            >
              <IoArrowBackCircleOutline className="w-6 h-6" />
              Volver al Menú
            </button>
            <button
              onClick={async () => {
                try {
                  // Clear local storage
                  localStorage.clear();
                  
                  // Make API call to invalidate the token on the server if needed
                  const token = Auth.getToken();
                  if (token) {
                    await axios.post('http://localhost:4000/api/auth/logout', {}, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                  }
                  
                  // Clear any auth state
                  Auth.logout();
                  
                  // Redirect to login page
                  navegar('/login');
                } catch (error) {
                  console.error('Error during logout:', error);
                  // Still clear local storage and redirect even if API call fails
                  Auth.logout();
                  navegar('/login');
                }
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
            >
              <LuLogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <LuUserCheck className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Lista de Auxiliares
                    </h1>
                  </div>
                </div>
        
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

      {/* Tabla de usuarios */}
      <UsuarioTabla  
        usuarios={usuarioFiltrados} 
        onCambiarEstado={cambiarEstado}
        onEditarUsuario={(usuario) => {
          setUsuarioEditando(usuario);
          setModalAbierto(true);
        }}
      />

      {/* Modal */}
      <ModalUsuario 
        isOpen={modalAbierto} 
        onClose={() => {
          setModalAbierto(false);
          setUsuarioEditando(null);
        }} 
        onAgregarUsuario={AgregarUsuario} 
        onEditarUsuario={editarUsuario}
        usuarioEditando={usuarioEditando}
      />
    </div>
    </div>
  );
}