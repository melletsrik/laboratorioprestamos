import { useState, useEffect } from "react"; 
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import { carrerasDisponibles } from "../data/carreras";
import MateriaTabla from "../components/VentanaMateria/MateriaTabla"; // para mostrar la tabla de materias
import MateriaSearchBar from "../components/VentanaMateria/MateriaSearchBar"; // para buscar materias
import MateriaModal from "../components/VentanaMateria/MateriaModal"; // para mostrar el modal de agregar materia
import { Auth } from "../utils/auth";
import { LuLogOut } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {  FiPlus } from "react-icons/fi";
import { LuBookMarked } from "react-icons/lu";

export default function VentanaMateria (){
  const [materia, setMateria] = useState([]);
  const [materiaFiltrados, setMateriaFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [carrera, setCarrera] = useState(carrerasDisponibles);
const navegar = useNavigate();

  const token = Auth.getToken("token"); 
  useEffect(() => {
    if (!token) {
      navegar("/");
    }
  }, [token, navegar]);

  if (!token) return null;

  // Cargar lista de materias desde backend
  const cargarMateria = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/materias', {
        headers: {
         Authorization: `Bearer ${token}`
       
      },
      });
      if (response.data && response.data.success) {
        setMateria(response.data.data);
        setMateriaFiltrados(response.data.data); // Actualizamos la lista filtrada también
        setMensaje('Materias cargadas correctamente');
      } else {
        setMateria([]);
        setMateriaFiltrados([]);
        setMensaje(response.data?.message || 'No se pudieron cargar las materias');
      }
    } catch (error) {
      console.error("Error al cargar materias:", error);
      setMateria([]);
      setMateriaFiltrados([]);
      setMensaje(`Error al cargar las materias: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para agregar materia desde modal
  const AgregarMateria = async (nuevaMateria) => {
    try {
      const token = Auth.getToken();
      if (!token) {
        setMensaje('No hay sesión activa');
        return false;
      }

      const materiaData = {
        nombre: nuevaMateria.nombre,
        id_carrera: parseInt(nuevaMateria.id_carrera) // Aseguramos que sea número
      };

      const response = await axios.post("http://localhost:4000/api/materias", materiaData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        await cargarMateria();
        setMensaje('Materia agregada correctamente');
        return true;
      } else {
        setMensaje(response.data.message || 'Error al agregar materia');
        return false;
      }
    } catch (error) {
      console.error("Error al agregar materia:", error);
      setMensaje(`Error al agregar materia: ${error.response?.data?.message || error.message}`);
      return false;
    }
  };

  // Función para manejar búsqueda
  const manejarBusqueda = (terminoBusqueda) => {
    if (terminoBusqueda.trim() === "") {
      setMateriaFiltrados(materia);
    } else {
      const filtrados = materia.filter(m =>
        m.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setMateriaFiltrados(filtrados);
    }
  };

  // Cargar materias al montar el componente
  useEffect(() => {
    cargarMateria();
  }, []);

  // Ocultar mensaje automáticamente después de 1 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

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
    <div className="max-w-7xl mx-auto px-6 py-8o">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <LuBookMarked className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Lista de Materias
                    </h1>
                  </div>
                </div>

        {/* Mensaje */}
        {mensaje && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-md text-center">
            {mensaje}
          </div>
        )}

        {/* Barra de búsqueda y botón agregar */}
        <div className="flex justify-between items-center mb-4">
          <MateriaSearchBar onBuscar={manejarBusqueda} />
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-red-700 hover:bg-red-750 text-white px-6 py-2 rounded-md font-semibold transition-colors"
          >
            Agregar Materia
          </button>
        </div>
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        </div>
      )}

      {/* Tabla de materias */}
      <MateriaTabla materia={materiaFiltrados} />

      {/* Modal */}
      <MateriaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onAgregarMateria={AgregarMateria}
        carrera={carrera}
      />
    </div>
    </div>
  );
}
