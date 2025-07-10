import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import EstudianteTabla from "../components/GestionarEstudiantes/EstudianteTabla";
import EstudiantesBusqueda from "../components/GestionarEstudiantes/EstudiantesBusqueda";
import EstudianteModal from "../components/GestionarEstudiantes/EstudianteModal";
import { Auth } from "../utils/auth";
import Button from "../components/Button";
import { LuLogOut } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FiPackage, FiPlus } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
export default function RegistrarEstudiante() {
  const [cargando, setCargando] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudianteEditar, setEstudianteEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const token = Auth.getToken();
  const navegar = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!token) {
      navegar("/");
      return;
    }

    // Verificar si tiene permiso para registrar estudiantes
    if (!Auth.hasPermission('estudiante:registrar')) {
      navegar('/unauthorized');
      return;
    }
  }, [token, navegar]);

  if (!token) return null;

  const listadoEstudiantes = async () => {
    setCargando(true);
    try {
      const response = await axios.get("http://localhost:4000/api/estudiantes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setEstudiantes(response.data.data);
        setEstudiantesFiltrados(response.data.data);
        setMensaje("Estudiantes cargados correctamente");
      } else {
        setEstudiantes([]);
        setEstudiantesFiltrados([]);
        setMensaje(response.data?.message || "No se pudieron cargar los estudiantes");
      }
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      setEstudiantes([]);
      setEstudiantesFiltrados([]);
      setMensaje(error.response?.data?.message || "Error al cargar los estudiantes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    listadoEstudiantes();
  }, []);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const AgregarEstudiante = async (nuevoEstudiante) => {
    const existe = estudiantes.some(
      (est) => Number(est.Registro) === Number(nuevoEstudiante.registro)
    );
    if (existe) {
      window.alert("Ya existe un estudiante con ese registro");
      return false;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/estudiantes",
        {
          registro: nuevoEstudiante.registro,
          nombre: nuevoEstudiante.nombre,
          apellido: nuevoEstudiante.apellido,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        // Actualizar localmente con el nuevo estudiante
        const nuevoEstudianteActualizado = {
          ...nuevoEstudiante,
          id_estudiante: response.data.data.id, // Usar el ID que devuelve el backend
          Registro: nuevoEstudiante.registro
        };
        
        // Actualizar el estado
        const nuevosEstudiantes = [...estudiantes, nuevoEstudianteActualizado];
        setEstudiantes(nuevosEstudiantes);
        setEstudiantesFiltrados(nuevosEstudiantes);
        
        // Cerrar modal y mostrar mensaje
        setModalAbierto(false);
        setMensaje('Estudiante registrado exitosamente');
        return true;
      } else {
        throw new Error(response.data.message || "Error al agregar estudiante");
      }
    } catch (error) {
      console.error("Error al agregar estudiante:", error);
      setMensaje(
        error.response?.data?.message || error.response?.data?.error || error.message
      );
      return false;
    }
  };

  const EditarEstudiante = async (datosEditados) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/estudiantes/${datosEditados.id_estudiante}`,
        {
          registro: datosEditados.registro,
          nombre: datosEditados.nombre,
          apellido: datosEditados.apellido,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        listadoEstudiantes();
        setMensaje("Estudiante editado correctamente");
        setModalAbierto(false);
        setEstudianteEditar(null);
      } else {
        throw new Error(response.data.message || "Error al editar estudiante");
      }
    } catch (error) {
      setMensaje(error.response?.data?.message || error.message);
    }
  };

  const buscarEstudiante = (terminoBusqueda) => {
    if (terminoBusqueda.trim() === "") {
      setEstudiantesFiltrados(estudiantes);
    } else {
      const filtrados = estudiantes.filter(
        (est) =>
          est.Registro.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          est.persona.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          est.persona.apellido.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setEstudiantesFiltrados(filtrados);
    }
  };

  const onEditar = (estudiante) => {
    setEstudianteEditar(estudiante);
    setModalAbierto(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              }}  className="flex items-center gap-2 text-red-600 hover:text-red-900 font-semibold"
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
        {/* Título */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <LuGraduationCap className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Lista de Estudiantes</h1>
          </div>

          {/* Buscador y botón */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="sm:w-2/3 w-full">
              <EstudiantesBusqueda onBuscar={buscarEstudiante} />
            </div>
            <div className="sm:w-auto w-full">
              <Button
                onClick={() => setModalAbierto(true)}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <FiPlus className="w-5 h-5" />
                Agregar Estudiante
              </Button>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div
            className={`p-4 mb-4 rounded-md ${
              mensaje.toLowerCase().includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* Cargando */}
        {cargando && (
          <div className="flex justify-center items-center h-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
          </div>
        )}

        {/* Tabla */}
        <EstudianteTabla estudiantes={estudiantesFiltrados} onEditar={onEditar} />
      </div>

      {/* Modal */}
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
