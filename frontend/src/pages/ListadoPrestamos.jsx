import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../utils/auth";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";

export default function ListadoPrestamos() {
  const [aPrestamos, setAPrestamos] = useState([]);
  const [lLoading, setLLoading] = useState(true);
  const [cError, setCError] = useState(null);
  const token = Auth.getToken("token");
  const navegar = useNavigate();

  useEffect(() => {
    if (!token) {
      navegar("/");
    }
  }, [token, navegar]);

  if (!token) return null;

  useEffect(() => {
    const controller = new AbortController();

    const f_fetchPrestamos = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log('Token:', token);
        if (!token) {
          throw new Error('No hay token de autenticación');
        }
        const response = await fetch("http://localhost:4000/api/prestamos", {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
          const errorData = await response.json().catch(() => {});
          console.error('Error en la respuesta:', {
            status: response.status,
            statusText: response.statusText,
            errorData
          });
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Respuesta del backend:', data);
        if (data.success && data.data) {
          console.log('Préstamos recibidos:', data.data);
          console.log('Préstamos activos:', data.data.filter(p => p.id_estado === '1'));
          console.log('Primer préstamo:', data.data[0]);
          console.log('Estado del primer préstamo:', typeof data.data[0].id_estado, data.data[0].id_estado);
          setAPrestamos(data.data);
        } else {
          console.error('Error en la respuesta del backend:', data);
          setCError('Error al cargar los préstamos');
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error('Error:', err);
          if (err.message === 'No hay token de autenticación') {
            setCError('Debe iniciar sesión para ver los préstamos');
          } else {
            setCError(err.message || 'Error al cargar los préstamos');
          }
        }
      } finally {
        setLLoading(false);
      }
    };

    f_fetchPrestamos();

    return () => controller.abort();
  }, []);

  const f_irADevolver = (p_prestamo) => {
    // Obtener el usuario actual
    const usuarioActual = JSON.parse(localStorage.getItem('user'));
    
    // Preparar los datos para el formulario de devolución
    const datosDevolucion = {
      ...p_prestamo,
      registro: p_prestamo.estudiante?.Registro,
      nombres: p_prestamo.estudiante?.persona?.nombre,
      apellidos: p_prestamo.estudiante?.persona?.apellido,
      asistente_entrega: p_prestamo.usuarioEntrega?.nombre + ' ' + p_prestamo.usuarioEntrega?.apellido,
      asistente_recepcion: usuarioActual.nombre + ' ' + usuarioActual.apellido,
      descripcion: '', // Campo opcional para descripción
      id_estado: 3, // Estado "Devuelto"
      fecha_devolucion: new Date().toISOString(),
      semestre: p_prestamo.semestre?.nombre?? "",
      id_materia: p_prestamo.materia?.id_materia,
      id_docente: p_prestamo.docente?.id_docente,
      id_modulo: p_prestamo.id_modulo,
      id_semestre: p_prestamo.id_semestre || p_prestamo.semestre?.id_semestre,

      detalles: p_prestamo.detalles.map(detalle => ({
        ...detalle,
          id_material: detalle.id_material,
  codigo_material: detalle.material?.codigo_material,
  nombre: detalle.material?.nombre,
  especificaciones: detalle.material?.especificaciones,
  cantidad: detalle.cantidad,
      cantidad_devuelta: detalle.cantidad // Por defecto se devuelve toda la cantidad
      })),
      
    };

    // Guardar los datos en localStorage
    localStorage.setItem('prestamoADevolver', JSON.stringify(datosDevolucion));
    // Redirigir a la página de registro con parámetro de devolución
    navegar('/registrar-prestamo?devolucion=1');
  };

  const f_formatDate = (p_dateStr) => {
    if (!p_dateStr) return "N/A";
    const date = new Date(p_dateStr);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString("es-PE");
  };

  if (lLoading) {
    return <p className="p-6 text-gray-600 italic">Cargando préstamos...</p>;
  }

  if (cError) {
    return (
      <p className="p-6 text-red-600 font-semibold">
        Ocurrió un error: {cError}
      </p>
    );
  }

  return (
    <div className="p-6">
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
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Préstamos activos
      </h2>

      <div
        className="overflow-x-auto rounded-md shadow-md"
        style={{
          borderColor: "var(--color-primary)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "black",
            }}
          >
            <tr>
             
              <th className="px-4 py-2">NRO </th>
              <th className="px-4 py-2">REGISTRO</th>
              <th className="px-4 py-2">ESTUDIANTE</th>
              <th className="px-4 py-2">FECHA PRÉSTAMO</th>
              <th className="px-4 py-2">MATERIA</th>
              <th className="px-4 py-2">DOCENTE</th>
              <th className="px-4 py-2">MÓDULO</th>
              <th className="px-4 py-2">AUXILIAR ENTREGO</th>
              <th className="px-4 py-2">NOMBRE MATERIAL</th>
              <th className="px-4 py-2">CANTIDAD </th>
            </tr>
          </thead>
          <tbody>
            {aPrestamos.filter(p => String(p.id_estado) === '1').map((p, i) => {
              const cNombreCompleto = `${p.estudiante?.persona?.nombre ?? "N/A"} ${p.estudiante?.persona?.apellido ?? ""}`;
              console.log('Préstamo:', p);
              console.log('Estado:', p.id_estado);
              return (
                <tr
                  key={p.id_prestamo}
                  style={{
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(234, 178, 178, 0.23)",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(158, 155, 153, 0.39)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "transparent" : "rgb(243, 243, 243)")
                  }
                >
                  <td className="px-4 py-2">{p.id_prestamo ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.estudiante?.Registro ?? "N/A"}</td>
                  <td className="px-4 py-2">{cNombreCompleto}</td>
                  <td className="px-4 py-2">{f_formatDate(p.fecha_prestamo)}</td>
                  <td className="px-4 py-2">{p.materia?.nombre ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.docente?.persona?.nombre ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.id_modulo ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.usuarioEntrega?.nombre + ' ' + p.usuarioEntrega?.apellido ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.detalles[0]?.material?.nombre ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.detalles[0]?.cantidad ?? "N/A"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => f_irADevolver(p)}
                      type="button"
                      style={{ backgroundColor: "var(--color-primary)" }}
                      className="text-white text-1xl px-4 py-2 rounded hover:brightness-90 transition"
                    >
                      Devolución
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
