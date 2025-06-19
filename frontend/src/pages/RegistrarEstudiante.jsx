import { useState, useEffect } from "react"; 
import axios from 'axios';
import EstudianteTabla from "../components/GestionarEstudiantes/EstudianteTabla";
import EstudiantesBusqueda from "../components/GestionarEstudiantes/EstudiantesBusqueda";
import EstudianteModal from "../components/GestionarEstudiantes/EstudianteModal";
import { Auth } from "../utils/auth";
import Button from "../components/Button";

export default function RegistrarEstudiante () {
  // Estado para Estudiantes
  const [cargando, setCargando]= useState(false); //estado de carga
  const [estudiantes, setEstudiantes] = useState([]); //estado para todos la lista Estudiantes
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para el modal
  const [estudianteEditar, setEstudianteEditar] = useState(null);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);//filtrara en busqueda de Estudiantes
  const [mensaje, setMensaje] = useState(""); // mostrara mensaje de error o exito
 
  // Función para cambiar el estado del Estudiante
  const EditarEstudiante = async (datosEditados) => {
    try {
      const token = Auth.getToken();
      if (!token) {
        setMensaje('No hay sesión activa');
        return null;
      }

      // Actualizar en el backend
      const response = await axios.put(
        `http://localhost:4000/api/estudiantes/${datosEditados.id_estudiante}`,
        {
          registro: datosEditados.registro,
          nombre: datosEditados.nombre,
          apellido: datosEditados.apellido
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
      listadoEstudiantes();
      setMensaje('Estudiante editado correctamente');
      setModalAbierto(false);
      setEstudianteEditar(null);
      } else {
        throw new Error(response.data.message || "Error al editar Estudiante");
      }
      } catch (error) {
        setMensaje(error.response?.data?.message || "Error al editar Estudiante: " + error.message);
      }
  };

  // Token de autenticación
  const token = Auth.getToken("token"); // Obtenemos el token 
  //localStorage sirve para almacenar datos en el navegador, ej token JWT después de iniciar sesion
  if (!token) {
      setMensaje('No hay sesión activa');
      return null;
    }
  const listadoEstudiantes = async ()=> {
    setCargando(true); //mostrara q esta cargando..
    try {
      const response = await axios.get("http://localhost:4000/api/estudiantes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.success){
        setEstudiantes(response.data.data);
        setEstudiantesFiltrados(response.data.data);
        setMensaje('Estudiantes cargados correctamente');
      }else{
        setEstudiantes([]);
        setEstudiantesFiltrados([]);
        setMensaje(response.data?.message || 'No se pudieron cargar los Estudiantes');
      }
    }catch (error) {
        console.error("Error al cargar Estudiantes:", error);
        setEstudiantes([]);
        setEstudiantesFiltrados([]);
      const mensajeError = error.response?.data?.message || 'No se pudieron cargar los Estudiantes';
      setMensaje(mensajeError);
    }
  };
    useEffect (() =>{
      listadoEstudiantes();
    },[]);

    // Función para agregar Estudiante dentro del modal
    const AgregarEstudiante = async (nuevoEstudiante) => {
    const existe = estudiantes.some(
      est => Number(est.Registro) === Number(nuevoEstudiante.registro)
    );
    if (existe) {
      setMensaje("Ya existe un estudiante con ese registro");
      window.alert("Ya existe un estudiante con ese registro");
      return false; // <--- El modal sigue abierto porque aquí termina la función
    }
    try {
      const token = Auth.getToken();
      if (!token) {
        setMensaje("No hay sesión activa");
        window.alert("No hay sesión activa");
        return false;
      }

      // Envía todos los datos directamente al backend
      const estudianteFormateado = {
        registro: nuevoEstudiante.registro,
        nombre: nuevoEstudiante.nombre,
        apellido: nuevoEstudiante.apellido
      };

      const response = await axios.post(
        "http://localhost:4000/api/estudiantes",
        estudianteFormateado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        listadoEstudiantes();
        setMensaje('Estudiante agregado correctamente');
        window.alert('¡Estudiante registrado exitosamente!');
        setModalAbierto(false); // Cierra el modal si todo sale bien
        return true;
      } else {
        throw new Error(response.data.message || "Error al agregar Estudiante");
      }
      } catch (error) {
      console.error("Error detallado:", error);
      setMensaje(error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al agregar Estudiante: " + error.message);
      window.alert(error.response?.data?.message || 
        error.response?.data?.error || 
        "Error al agregar Estudiante: " + error.message); // <-- ALERTA para errores backend
        return false;
    }
  };

    //funcion de busqueda
    const buscarEstudiante= (terminoBusqueda) =>{
      if(terminoBusqueda.trim () === ""){
        setEstudiantesFiltrados(estudiantes);
        return;
      }else{
        const filtrados= estudiantes.filter(est => 
          est.Registro.toLowerCase().includes(terminoBusqueda.toLowerCase()) || 
          est.persona.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          est.persona.apellido.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setEstudiantesFiltrados(filtrados);
      }
    };
    //Funcion editar Estudiante
    const onEditar = (estudiante) => {
      setEstudianteEditar(estudiante); // Guarda el estudiante a editar
      setModalAbierto(true);           // Abre el modal
    };
     
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Estudiantes</h1>

        {/* Mensaje de éxito o error */}
      {mensaje && (
        <div className="mb-4 text-center text-green-600 font-semibold">
          {mensaje}
        </div>
      )}
        
        {/* Barra de búsqueda y botón agregar */}
        <div className="flex justify-between items-center mb-4 gap-2">
          <EstudiantesBusqueda 
            onBuscar={buscarEstudiante} 
            />
          <Button variant="red" onClick={() => 
            setModalAbierto(true)} 
            className="px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer w-full sm:w-auto">
            Agregar Estudiante
          </Button>
        </div>
      </div>

      {/* Loading spinner */}
      

      {/* Tabla de Estudiantes */}
      <EstudianteTabla 
        estudiantes={estudiantesFiltrados} 
        onEditar={onEditar} 
      />

      {/* Modal  */}
      <EstudianteModal
      isOpen={modalAbierto}
      onClose={() => {
        setModalAbierto(false);
        setEstudianteEditar(null);
      }}
      onAgregarEstudiante={AgregarEstudiante}
      estudianteEditar={estudianteEditar}
      onEditarEstudiante={EditarEstudiante}
    />
      
    </div>
  );
}