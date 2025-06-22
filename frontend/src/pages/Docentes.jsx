import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import DocenteTabla from "../components/GestionarDocente/DocenteTabla";
import DocenteBusqueda from "../components/GestionarDocente/DocenteBusqueda";
import DocenteModal from "../components/GestionarDocente/DocenteModal";
import { Auth } from "../utils/auth";
import Button from "../components/Button";
import { LuLogOut } from "react-icons/lu";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {  FiPlus } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
export default function Docente() {
  const [cargando, setCargando] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [docenteFiltrados, setDocentesFiltrados] = useState([]);
  const [docenteEditar, setDocenteEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navegar = useNavigate();

  const token = Auth.getToken("token"); 
  useEffect(() => {
    if (!token) {
      navegar("/");
    }
  }, [token, navegar]);

  if (!token) return null;

  const EditarDocente = async (datosEditados) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/docentes/${datosEditados.id_docente}`,
        {
          nombre: datosEditados.nombre,
          apellido: datosEditados.apellido,
          estado: datosEditados.estado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        listadoDocentes();
        setMensaje("Docente editado correctamente");
        setModalAbierto(false);
        setDocenteEditar(null);
      } else {
        throw new Error(response.data.message || "Error al editar docente");
      }
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error al editar docente: " + error.message);
    }
  };

  const listadoDocentes = async () => {
    setCargando(true);
    try {
      const response = await axios.get("http://localhost:4000/api/docentes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setDocentes(response.data.data);
        setDocentesFiltrados(response.data.data);
        setMensaje("Docentes cargados correctamente");
      } else {
        setDocentes([]);
        setDocentesFiltrados([]);
        setMensaje(response.data?.message || "No se pudieron cargar los docentes");
      }
    } catch (error) {
      console.error("Error al cargar docentes:", error);
      setDocentes([]);
      setDocentesFiltrados([]);
      setMensaje(error.response?.data?.message || "No se pudieron cargar los docentes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    listadoDocentes();
  }, []);

  const AgregarDocente = async (nuevoDocente) => {
    try {
      const response = await axios.post("http://localhost:4000/api/docentes", nuevoDocente, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        listadoDocentes();
        setMensaje("Docente agregado correctamente");
      } else {
        throw new Error(response.data.message || "Error al agregar docente");
      }
    } catch (error) {
      console.error("Error al agregar docente:", error);
      setMensaje(error.response?.data?.message || "Error al agregar docente");
    }
  };

  const buscarDocente = (terminoBusqueda) => {
    if (terminoBusqueda.trim() === "") {
      setDocentesFiltrados(docentes);
    } else {
      const filtrados = docentes.filter(
        (docente) =>
          docente.persona.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          docente.persona.apellido.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
      setDocentesFiltrados(filtrados);
    }
  };

  const onEditar = (docente) => {
    setDocenteEditar(docente);
    setModalAbierto(true);
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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
  <div className="flex items-center gap-2 mb-4">
    <LuUsers className="w-6 h-6 text-red-600 " />
    <h1 className="text-2xl font-bold">Lista de Docentes</h1>
  </div>
</div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="sm:w-2/3 w-full">
              <DocenteBusqueda onBuscar={buscarDocente} />
            </div>
            <div className="sm:w-auto w-full">
              <Button
                variant="red"
                onClick={() => setModalAbierto(true)}
                className="w-full sm:w-auto px-6 py-2 rounded-md font-semibold transition-colors"
              >
                Agregar Docente
              </Button>
            </div>
          </div>
        

        {cargando && (
          <div className="flex justify-center items-center h-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
          </div>
        )}

        <DocenteTabla docentes={docenteFiltrados} onEditar={onEditar} />

        <DocenteModal
          isOpen={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setDocenteEditar(null);
          }}
          onAgregarDocente={AgregarDocente}
          docenteEditar={docenteEditar}
          onEditarDocente={EditarDocente}
        />
      </div>
    </div>
  );
}
