import { useState, useEffect } from "react"; 
import axios from 'axios';
import DocenteTabla from "../components/GestionarDocente/DocenteTabla";
import DocenteBusqueda from "../components/GestionarDocente/DocenteBusqueda";
import DocenteModal from "../components/GestionarDocente/DocenteModal";
import { Auth } from "../utils/auth";

export default function Docente () {
  // Estado para docentes
  const [cargando, setCargando]= useState(false); //estado de carga
  const [docentes, setDocentes] = useState([]); //estado para todos la lista docentes
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para el modal
  const [docenteFiltrados, setDocentesFiltrados]= useState([]);//filtrara en busqueda de docentes
  const [mensaje, setMensaje] = useState(""); // mostrara mensaje de error o exito
 
  // Función para cambiar el estado del docente
  const cambiarEstado = async (idDocente, estado) => {
    try {
      const token = Auth.getToken();
      if (!token) {
        setMensaje('No hay sesión activa');
        return;
      }

      // Actualizar en el backend
      const response = await axios.put(
        `http://localhost:4000/api/docentes/${idDocente}/estado`,
        { 
          activo: estado
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.data.success) {
        // Actualizar localmente
        const nuevosDocentes = docentes.map(doc => 
          doc.id_docente === idDocente ? { ...doc, activo: estado } : doc
        );
        setDocentes(nuevosDocentes);
        setDocentesFiltrados(nuevosDocentes);
        setMensaje(estado ? 'Docente activado correctamente' : 'Docente desactivado correctamente');
      } else {
        setMensaje(response.data.message || (estado ? 'Error al activar docente' : 'Error al desactivar docente'));
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setMensaje(`Error al ${estado ? 'activar' : 'desactivar'} docente: ${error.response?.data?.message || error.message}`);
    }
  };

  // Token de autenticación
  const token = Auth.getToken("token"); // Obtenemos el token 
  //localStorage sirve para almacenar datos en el navegador, ej token JWT después de iniciar sesion
  if (!token) {
      setMensaje('No hay sesión activa');
      return null;
    }
  const listadoDocentes = async ()=> {
    setCargando(true); //mostrara q esta cargando..
    try {
      const response = await axios.get("http://localhost:4000/api/docentes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.success){
        setDocentes(response.data.data);
        setDocentesFiltrados(response.data.data);
        setMensaje('Docentes cargados correctamente');
      }else{
        setDocentes([]);
        setDocentesFiltrados([]);
        setMensaje(response.data?.message || 'No se pudieron cargar los docentes');
      }
    }catch (error){
        console.error("Error al cargar docentes:", error);
        setDocentes([]);
        setDocentesFiltrados([]);
        setMensaje(response.data?.message || 'No se pudieron cargar los docentes');
    }finally {
        setCargando(false);
    }
  };
    useEffect (() =>{
      listadoDocentes();
    },[]);

    //Funcion para agregar docente dentro del modal
    const AgregarDocente = async (nuevoDocente) => {
      try {
        const token = Auth.getToken();
        if (!token){
          setMensaje("No hay sesión activa"); //si no esta autenticado el usuario no puede agregar docente
          return;
        }
        const response= await axios.post("http://localhost:4000/api/docentes", nuevoDocente, 
          {
            headers:{
              Authorization: `Bearer ${token}`,
          }
          }
        );
        //refresca la lista de docentes
        if (response.data && response.data.success){
          listadoDocentes();
          setMensaje('Docente agregado correctamente');
        } else {
          throw new Error(response.data.message || "Error al agregar docente");
        }
      }catch (error){
        console.error("Error al agregar docente:", error);
        setMensaje(error.response?.data?.message || "Error al agregar docente");
      }
    };

    //funcion de busqueda
    const buscarDocente= (terminoBusqueda) =>{
      if(terminoBusqueda.trim () === ""){
        setDocentesFiltrados(docentes);
        return;
      }else{
        const filtrados= docentes.filter(docente => docente.persona.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        docente.persona.apellido.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setDocentesFiltrados(filtrados);
      }
    };
    //Funcion editar docente
    const onEditar =(id)=>{
      setMensaje(`Editando docente con ID: ${id}`);
    console.log('Editando docente:', id);
     };

     
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Docentes</h1>
        
        {/* Barra de búsqueda y botón agregar */}
        <div className="flex justify-between items-center mb-4">
          <DocenteBusqueda onBuscar={buscarDocente} />
          <button onClick={() => setModalAbierto(true)} className="bg-red-700 hover:bg-red-750 text-white px-6 py-2 rounded-md font-semibold transition-colors">
            Agregar Docente
          </button>
        </div>
      </div>

      {/* Loading spinner */}
      {cargando && (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        </div>
      )}

      {/* Tabla de docentes */}
      <DocenteTabla docentes={docenteFiltrados} cambiarEstado={cambiarEstado} onEditar={onEditar} />

      {/* Modal  */}
      <DocenteModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onAgregarDocente={AgregarDocente} />
      
      {cargando && (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        </div>
      )}
    </div>
  );
};