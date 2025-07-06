import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth } from "../utils/auth";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import Swal from 'sweetalert2';

// Función para formatear fechas al formato YYYY-MM-DD HH:MM:SS
const formatearFechaBD = (fecha = new Date()) => {
  // Asegurarse de que la fecha esté en la zona horaria local
  const fechaLocal = new Date(fecha);
  const offset = fechaLocal.getTimezoneOffset() * 60000; // Diferencia en milisegundos
  const fechaBolivia = new Date(fechaLocal.getTime() - offset);
  
  const pad = (num) => num.toString().padStart(2, '0');
  const year = fechaBolivia.getFullYear();
  const month = pad(fechaBolivia.getMonth() + 1);
  const day = pad(fechaBolivia.getDate());
  const hours = pad(fechaBolivia.getHours());
  const minutes = pad(fechaBolivia.getMinutes());
  const seconds = pad(fechaBolivia.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const formatearFechaUI = (fecha = new Date()) => {
  const fechaLocal = new Date(fecha);
  const pad = (num) => num.toString().padStart(2, '0');
  const year = fechaLocal.getFullYear();
  const month = pad(fechaLocal.getMonth() + 1);
  const day = pad(fechaLocal.getDate());
  const hours = pad(fechaLocal.getHours());
  const minutes = pad(fechaLocal.getMinutes());
  const seconds = pad(fechaLocal.getSeconds());
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const estadosPrestamo = [
  { id_estado: 1, nombre: "Activo" },
  { id_estado: 3, nombre: "Devuelto" }
];

export default function RegistroPrestamo() {
  const token = Auth.getToken();
  const navegar = useNavigate();
  const [searchParams] = useSearchParams();
  const idPrestamoEditar = searchParams.get('editar');
  const [modoEdicion, setModoEdicion] = useState(!!idPrestamoEditar);
  const [cargandoDatos, setCargandoDatos] = useState(!!idPrestamoEditar);
  const [form, setForm] = useState({
    registro: "",
    nombres: "",
    apellidos: "",
    asistente_entrega: "",
    asistente_recepcion: "",
    observaciones: "",
    id_estado: "1",
  });
function mostrarAlerta(tipo="info", titulo ="", mensaje=""){
  Swal.fire({
    icon: tipo, title: titulo, text:mensaje, confirmButtonColor: "#2563eb", timer: 2500, showConfirmButton:false
  });
}
  const [detalles, setDetalles] = useState([]);
  const [searchTerm] = useState('');
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_material: "",
    codigo_material: "",
    nombre: "",
    especificaciones: "",
    cantidad: 1,
    descripcion_devolucion: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ultimoTimeout, setUltimoTimeout] = useState(null);

  const [materiaBuscada, setMateriaBuscada] = useState("");
  const [semestreBuscado, setSemestreBuscado] = useState("");
  const [prestamoADevolver, setPrestamoADevolver] = useState(null);
  const esDevolucion = searchParams.get("devolucion") === "1";
  // Cargar datos del préstamo si estamos en modo edición
  useEffect(() => {
    const cargarPrestamo = async () => {
      if (!idPrestamoEditar) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/prestamos/${idPrestamoEditar}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al cargar el préstamo');
        
        const { data: prestamo } = await response.json();
        
        // Update the form with loan data
        setForm(prev => ({
          ...prev,
          registro: prestamo.estudiante?.Registro || '',
          nombres: prestamo.estudiante?.persona?.nombre || '',
          apellidos: prestamo.estudiante?.persona?.apellido || '',
          asistente_entrega: prestamo.usuarioEntrega?.nombre ? 
            `${prestamo.usuarioEntrega.nombre} ${prestamo.usuarioEntrega.apellido}` : '',
          asistente_recepcion: prestamo.asistente_recepcion || '',
          observaciones: prestamo.observaciones || '',
          id_estado: String(prestamo.id_estado) || '1',
        }));
        
        // Update loan details
        if (prestamo.detalles && prestamo.detalles.length > 0) {
          const detallesFormateados = prestamo.detalles.map(detalle => ({
            id_material: detalle.id_material,
            codigo_material: detalle.material?.codigo_material || '',
            nombre: detalle.material?.nombre || '',
            especificaciones: detalle.material?.especificaciones || '',
            cantidad: detalle.cantidad,
            cantidad_devuelta: detalle.cantidad_devuelta || detalle.cantidad,
            cantidad_prestada: detalle.cantidad, // Store the original loaned amount
            descripcion_devolucion: detalle.descripcion_devolucion || ''
          }));
          setDetalles(detallesFormateados);
        }
        
        // Update other fields
        if (prestamo.materia) {
          setMateriaBuscada(prestamo.materia.nombre);
          setIdMateriaSeleccionada(String(prestamo.id_materia || ''));
        }
        if (prestamo.semestre) {
          setSemestreBuscado(prestamo.semestre.nombre);
          setIdSemestreSeleccionada(String(prestamo.id_semestre || ''));
        }
        if (prestamo.docente) {
          setIdDocenteSeleccionado(String(prestamo.id_docente || ''));
        }
        if (prestamo.modulo) {
          setIdModuloSeleccionado(String(prestamo.id_modulo || ''));
        }
        
      } catch (error) {
        console.error('Error al cargar el préstamo:', error);
        mostrarAlerta('error', 'Error', 'No se pudo cargar el préstamo para edición');
      } finally {
        setCargandoDatos(false);
      }
    };
    
    if (modoEdicion) {
      cargarPrestamo();
    }
  }, [idPrestamoEditar, modoEdicion]);

  useEffect(() => {
    if (!token) {
      navegar("/");
    }
  }, [token, navegar]);

  if (!token) return null;

  const [fechaHoraActual, setFechaHoraActual] = useState("");

  const [estudianteNoEncontrado, setEstudianteNoEncontrado] = useState(false);
  const [idEstudiante, setIdEstudiante] = useState(null);

  // Agrega estos estados para materia, módulo y semestre seleccionados
  const [idMateriaSeleccionada, setIdMateriaSeleccionada] = useState("");
  const [idModuloSeleccionado, setIdModuloSeleccionado] = useState("");
  const [idSemestreSeleccionada, setIdSemestreSeleccionada] = useState("");



  // Buscar estudiante por registro
  async function buscarEstudiantePorRegistro(registro) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api/estudiantes/registro/${registro}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  }
  // Autocompletar nombres y apellidos al cambiar el registro
  useEffect(() => {
    if (form.registro) {
      buscarEstudiantePorRegistro(form.registro).then(estudiante => {
        if (estudiante) {
          setForm(prev => ({
            ...prev,
            nombres: estudiante.persona.nombre,
            apellidos: estudiante.persona.apellido,
          }));
          setIdEstudiante(estudiante.id_estudiante);
          setEstudianteNoEncontrado(false);
        } else {
          setForm(prev => ({
            ...prev,
            nombres: "",
            apellidos: "",
          }));
          setIdEstudiante(null);
          setEstudianteNoEncontrado(true);
        }
      });
    } else {
      setForm(prev => ({
        ...prev,
        nombres: "",
        apellidos: "",
      }));
      setIdEstudiante(null);
      setEstudianteNoEncontrado(false);
    }
  }, [form.registro]);

  // Buscar por materia, módulo y semestre
  const [materias, setMaterias] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/materias", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setMaterias(data.data);
        }
      });
  }, []);

  // Autocompletar auxiliar entrega desde localStorage
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    if (usuario && usuario.nombre && usuario.apellido) {
      setForm(prev => ({
        ...prev,
        asistente_entrega: usuario.nombre + " " + usuario.apellido,
      }));
    }
  }, []);

  // Si es devolución, autollenar datos
  useEffect(() => {
    const prestamoData = JSON.parse(localStorage.getItem("prestamoADevolver"));
    const usuario = JSON.parse(localStorage.getItem("user"));
    if (esDevolucion && prestamoData && usuario) {
      setPrestamoADevolver(prestamoData);
      setForm(prev => ({
        ...prev,
        registro: prestamoData.registro || "",
        nombres: prestamoData.nombres || "",
        apellidos: prestamoData.apellidos || "",
        asistente_entrega: prestamoData.asistente_entrega || "",
        asistente_recepcion: usuario.nombre + " " + usuario.apellido,
        fecha_devolucion: prestamoData.fecha_devolucion || formatearFechaBD(),
        observaciones: prestamoData.observaciones || "",
        
        // NO establecemos id_estado, lo dejamos como estaba o que el usuario lo elija
      }));
      setDetalles(prestamoData.detalles || []);
      setIdMateriaSeleccionada(prestamoData.id_materia?.toString() || "");
      setIdModuloSeleccionado(prestamoData.id_modulo?.toString() || "");
      setIdSemestreSeleccionada(prestamoData.id_semestre?.toString() || "");
      setIdDocenteSeleccionado(prestamoData.id_docente?.toString() || "");
    }
  }, []);

  // Manejo de devolución de préstamo
  const handleDevolucion = async () => {
    if (!esDevolucion) return;
    
    try {
      setIsLoading(true);
      const prestamoData = JSON.parse(localStorage.getItem('prestamoADevolver'));
      const prestamoId = idPrestamoEditar || (prestamoData && prestamoData.id_prestamo);
      
      console.log('Datos del préstamo:', { prestamoId, prestamoData, idPrestamoEditar });
      
      if (!prestamoId) {
        throw new Error("No se pudo obtener el ID del préstamo a devolver");
      }

      // Obtener el valor actual del campo asistente_recepcion del formulario
      const asistenteRecepcion = form.asistente_recepcion || '';
      // Validar que se haya especificado el auxiliar de recepción
      if (!asistenteRecepcion.trim()) {
        throw new Error("Debe especificar el auxiliar que recibe los materiales");
      }

      // Validar cantidades devueltas
      const detallesConErrores = detalles.filter(detalle => {
        const cantidadDevuelta = Number(detalle.cantidad_devuelta) || 0;
        const cantidadPrestada = Number(detalle.cantidad_prestada || detalle.cantidad) || 0;
        return cantidadDevuelta <= 0 || cantidadDevuelta > cantidadPrestada;
      });

      if (detallesConErrores.length > 0) {
        throw new Error("Las cantidades devueltas no son válidas. Asegúrese de que las cantidades sean mayores a 0 y no excedan las cantidades prestadas.");
      }

      // Obtener el usuario actual
      const usuario = JSON.parse(localStorage.getItem("user"));
      if (!usuario) {
        throw new Error("No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.");
      }

      // Preparar los detalles de devolución con los IDs de los detalles de préstamo
      const detallesDevolucion = detalles.map(detalle => ({
        id_detalle_prestamo: detalle.id_detalle_prestamo, // Asegurarse de que este campo esté disponible
        id_material: parseInt(detalle.id_material),
        cantidad: parseInt(detalle.cantidad_prestada || detalle.cantidad) || 0,
        cantidad_devuelta: parseInt(detalle.cantidad_devuelta || detalle.cantidad) || 0,
        descripcion_devolucion: String(detalle.descripcion_devolucion || "")
      }));

      // Preparar los datos de la devolución
      const datosDevolucion = {
        id_usuario_recibe: usuario.id, // ID del usuario que recibe
        detalles: detallesDevolucion,
        observaciones: String(form.observaciones || ""),
        fecha_devolucion: formatearFechaBD(new Date()),
        asistente_recepcion: String(form.asistente_recepcion || "")
      };

      
      
      console.log("Datos de devolución:", datosDevolucion);
      
      // Enviar la solicitud de devolución al endpoint específico para devoluciones
      const response = await fetch(`http://localhost:4000/api/prestamos/${prestamoId}/devolver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosDevolucion)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Error en la respuesta del servidor:", responseData);
        throw new Error(responseData.message || "Error al registrar la devolución");
      }
      if (responseData.data?.fecha_devolucion) {
        setForm(prev => ({
          ...prev,
          fecha_devolucion: responseData.data.fecha_devolucion
        }));
      }     
      // Mostrar mensaje de éxito
      await mostrarAlerta("success", "¡Éxito!", "Devolución registrada correctamente");
      
      // Limpiar datos de la devolución
      localStorage.removeItem('prestamoADevolver');
      
      // Redirigir al menú correspondiente
      const rol = localStorage.getItem("rol");
      const redirectPath = rol === "Administrativo" ? "/menu-admin" : "/menu-aux";
      navegar(redirectPath);
      
    } catch (error) {
      console.error("Error en el proceso de devolución:", error);
      mostrarAlerta(
        "error",
        "Error",
        error.message || "Ocurrió un error al procesar la devolución. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // No ejecutar automáticamente handleDevolucion al montar el componente
  // Se ejecutará solo al enviar el formulario

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "descripcion") {
      setForm((prev) => ({
        ...prev,
        [esDevolucion ? "descripcion_devolucion" : "descripcion_prestamo"]: value
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  const [docentes, setDocentes] = useState([]);
  const [idDocenteSeleccionado, setIdDocenteSeleccionado] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/docentes", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDocentes(data.data);
        }
      });
  }, []);

  // Buscar material por código
async function buscarMaterialPorCodigo(codigo) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:4000/api/materiales/${codigo}`, {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (data.success && data.data) {
      // Ajustar el formato de la respuesta para que coincida con lo que esperamos
      return {
        id_material: data.data.id_material,
        codigo_material: data.data.codigo_material,
        nombre: data.data.nombre,
        especificaciones: data.data.especificaciones || '',
        cantidad_total: data.data.cantidad_total || 0
      };
    }
    return null;
  } catch (error) {
    console.error("Error al buscar material:", error);
    return null;
  }
}
useEffect(() => {
  let buffer = "";
  let timeoutId;

  const handleKeyPress = (e) => {
    // Solo procesar si el input de código está en foco
    if (document.activeElement.name !== "codigo_material") return;

    // Ignorar la tecla Enter
    if (e.key === 'Enter') return;

    // Solo permitir números y letras (evitar caracteres especiales)
    if (!/[0-9a-zA-Z]/.test(e.key)) return;

    buffer += e.key;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      // Si hay algún texto en el buffer, intentar buscar el material
      if (buffer.trim()) {
        const codigoEscaneado = buffer.trim();
        const material = await buscarMaterialPorCodigo(codigoEscaneado);
        
        if (material) {
          // Actualizamos el código y la cantidad disponible del material
          setNuevoDetalle((prev) => ({
            ...prev,
            codigo_material: material.codigo_material,
            cantidad: 1, // Mantenemos la cantidad en 1 hasta que el usuario la cambie manualmente
            cantidad_disponible: material.cantidad_total || 0
          }));
          // Limpiar el buffer pero no el input
          buffer = "";
        } else {
          alert("Material no encontrado para el código escaneado.");
          buffer = "";
        }
      }
    }, 100); // Ajustado a 100ms para mejor detección
  };

    // Agregar el listener de eventos
    document.addEventListener('keydown', handleKeyPress);
  return () => {
    document.removeEventListener("keydown", handleKeyPress);
    clearTimeout(timeoutId);
  };
}, []);

  // Agregar detalle a la lista
  async function agregarDetalle() {
    if (!nuevoDetalle.codigo_material || nuevoDetalle.cantidad <= 0) {

      mostrarAlerta("error", "Falta material", "Por favor, ingrese un código de material válido y una cantidad mayor a 0'");
      
      return;
    }

    try {
      // Buscar el material completo usando el código
      const material = await buscarMaterialPorCodigo(nuevoDetalle.codigo_material);
      if (!material) {
        alert('Material no encontrado en el sistema');
        return;
      }

      // Verificar si ya existe un detalle con el mismo material
      const idx = detalles.findIndex(d => d.codigo_material === nuevoDetalle.codigo_material);
      if (idx !== -1) {
        // Si existe, actualizar la cantidad
        const actualizados = [...detalles];
        actualizados[idx].cantidad += nuevoDetalle.cantidad;
        setDetalles(actualizados);
      } else {
        // Si no existe, agregar nuevo detalle con todos los datos del material
        setDetalles([...detalles, {
          id_material: material.id_material,
          codigo_material: material.codigo_material,
          nombre: material.nombre,
          especificaciones: material.especificaciones || '',
          cantidad: nuevoDetalle.cantidad,
          cantidad_disponible: material.cantidad_total || 0,
          descripcion_devolucion: ''
        }]);
      }

      // Limpiar el formulario de detalle
      setNuevoDetalle({
        id_material: "",
        codigo_material: "",
        nombre: "",
        especificaciones: "",
        cantidad: 1,
        descripcion_devolucion: ""
      });
    } catch (error) {
      console.error('Error al agregar detalle:', error);
      alert('Error al procesar el material. Por favor, intente nuevamente.');
    }
  }

  function handleDetalleChange(e) {
  const { name, value } = e.target;

  setNuevoDetalle((prev) => ({
    ...prev,
    [name]: name === "cantidad" ? parseInt(value, 10) || 1 : value,
  }));
}


  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (detalles.length === 0) {
      mostrarAlerta("error", "Error", "Debe agregar al menos un material");
      return;
    }
  
    try {
      setIsLoading(true);
      
      // Obtener el usuario actual
      const usuario = JSON.parse(localStorage.getItem("user"));
      if (!usuario) {
        throw new Error("No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.");
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      // Si es una devolución, manejarla de manera diferente
      if (esDevolucion) {
        await handleDevolucion();
        return;
      }
  
      // Si estamos en modo edición, actualizamos los detalles
      if (modoEdicion && idPrestamoEditar) {
        const prestamoId = idPrestamoEditar || JSON.parse(localStorage.getItem('prestamoADevolver'))?.id_prestamo;
        
        if (!prestamoId) {
          throw new Error("No se pudo obtener el ID del préstamo a actualizar");
        }
        
        // Validar que haya al menos un material
        if (detalles.length === 0) {
          mostrarAlerta("error", "Error", "Debe agregar al menos un material");
          return;
        }
        
        const datosActualizacion = {
          detalles: detalles.map(detalle => ({
            id_material: parseInt(detalle.id_material),
            cantidad: parseInt(detalle.cantidad) || 1,
            cantidad_devuelta: detalle.cantidad_devuelta || detalle.cantidad,
            descripcion_devolucion: detalle.descripcion_devolucion || ""
          })),
          observaciones: form.observaciones || "",
          id_estado: form.id_estado ? parseInt(form.id_estado) : 1
        };
  
        console.log("Actualizando préstamo con datos:", datosActualizacion);
        
        const response = await fetch(`http://localhost:4000/api/prestamos/${prestamoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(datosActualizacion)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Error al actualizar el préstamo");
        }
        
        // Show success message
        mostrarAlerta("success", "¡Éxito!", "Devolución registrada correctamente");
        
        // Clear the loan from localStorage
        localStorage.removeItem('prestamoADevolver');
        
        // Redirect to appropriate menu
        const rol = localStorage.getItem("rol");
        const redirectPath = rol === "Administrativo" ? "/menu-admin" : "/menu-aux";
        navegar(redirectPath);
      }

      const camposFaltantes = [];
        if (!idEstudiante) camposFaltantes.push("estudiante");
        if (!idModuloSeleccionado) camposFaltantes.push("módulo");
        if (!idSemestreSeleccionada) camposFaltantes.push("semestre");
        if (detalles.length === 0) camposFaltantes.push("materiales");

        if (camposFaltantes.length > 0) {
          throw new Error(`Faltan campos obligatorios: ${camposFaltantes.join(", ")}`);
        }

        // Ensure module and semester are valid numbers
        const idModulo = Number(idModuloSeleccionado);
        const idSemestre = Number(idSemestreSeleccionada);

        if (isNaN(idModulo) || idModulo === 0) {
          throw new Error("Debe seleccionar un módulo válido");
        }

        if (isNaN(idSemestre) || idSemestre === 0) {
          throw new Error("Debe seleccionar un semestre válido");
        }

        // Add this debug log right before the fetch
        console.log("Validando datos del préstamo:", {
          idEstudiante,
          idModuloSeleccionado,
          idSemestreSeleccionada,
          detallesLength: detalles.length,
          usuarioId: usuario?.id
        });
  
      // Código para crear un nuevo préstamo
      const datosPrestamo = {
        id_estudiante: Number(idEstudiante),
        id_usuario_entrega: Number(usuario.id),
        fecha_prestamo: formatearFechaBD(), // Para préstamos nuevos
        id_estado: 1,
        id_modulo: Number(idModuloSeleccionado) || null,
        id_semestre: Number(idSemestreSeleccionada) || null,
        id_materia: idMateriaSeleccionada ? Number(idMateriaSeleccionada) : null,
        id_docente: idDocenteSeleccionado ? Number(idDocenteSeleccionado) : null,
        observaciones: form.observaciones || "",
        asistente_entrega: form.asistente_entrega || "",
        asistente_recepcion: esDevolucion ? form.asistente_recepcion : null,
        detalles: detalles.map(detalle => ({
          id_material: Number(detalle.id_material),
          cantidad: Number(detalle.cantidad) || 1,
          descripcion_devolucion: String(detalle.descripcion_devolucion || "")
        }))
      };
  
      console.log("Datos del préstamo a enviar:", JSON.stringify(datosPrestamo, null, 2));
  
      const response = await fetch("http://localhost:4000/api/prestamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosPrestamo)
      });
  
      const responseData = await response.json().catch(e => {
        console.error("Error al parsear la respuesta:", e);
        return { message: "Error al procesar la respuesta del servidor" };
      });
  
      if (!response.ok) {
        console.error("Error del servidor:", {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        throw new Error(responseData.message || "Error al registrar el préstamo");
      }
  
      // Mostrar mensaje de éxito
      mostrarAlerta("success", "¡Éxito!", "Préstamo registrado correctamente");
      
      // Limpiar el formulario
      setForm({
        registro: "",
        nombres: "",
        apellidos: "",
        asistente_entrega: form.asistente_entrega,
        asistente_recepcion: "",
        observaciones: "",
        id_estado: "1"
      });
      setDetalles([]);
      setIdEstudiante(null);
      setIdMateriaSeleccionada("");
      setIdModuloSeleccionado("");
      setIdSemestreSeleccionada("");
      
      // Redirigir al menú correspondiente después de 1.5 segundos
      setTimeout(() => {
        const rol = localStorage.getItem("rol");
        if (rol === "Administrativo") {
          navegar("/menu-admin");
        } else if (rol === "Auxiliar") {
          navegar("/menu-aux");
        } else {
          // Si no se reconoce el rol, redirigir a la página de inicio de sesión
          navegar("/login");
        }
      }, 1500);
      
    } catch (error) {
      console.error("Error al procesar el préstamo:", error);
      mostrarAlerta("error", "Error", error.message || "Ocurrió un error al procesar el préstamo");
    } finally {
      setIsLoading(false);
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-xl">
                <LuClipboardList className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {modoEdicion ? 'Editar Préstamo' : 'Registro de Préstamo'}
              </h1>
            </div>
            {modoEdicion && (
              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                Modo Edición
              </span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
        {/* Registro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="registro">
              Registro (Estudiante o Docente)
            </label>
            <input
              type="text"
              id="registro"
              name="registro"
              value={form.registro}
              onChange={e => setForm(prev => ({ ...prev, registro: e.target.value }))}
              readOnly={esDevolucion}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            />
            {estudianteNoEncontrado && (
              <span className="text-xs text-red-600">Estudiante no encontrado</span>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="nombres">
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={form.nombres}
              readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 cursor-not-allowed text-gray-700"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="apellidos">
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={form.apellidos}
              readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 cursor-not-allowed text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="asistente_entrega">
              Auxiliar Entrega:
            </label>
            <input
              type="text"
              id="asistente_entrega"
              name="asistente_entrega"
              value={form.asistente_entrega}
              readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 cursor-not-allowed text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="asistente_recepcion">
              Auxiliar Recepcion:
            </label>
            <input
              type="text"
              id="asistente_recepcion"
              name="asistente_recepcion"
              value={form.asistente_recepcion}
              onChange={e => setForm(prev => ({ ...prev, asistente_recepcion: e.target.value }))}
              readOnly={!esDevolucion}
              required={esDevolucion}
              className={`w-full border ${esDevolucion ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} rounded-lg px-4 py-2.5 ${esDevolucion ? 'focus:ring-2 focus:ring-red-500 focus:border-transparent' : 'cursor-not-allowed'}`}
            />
          </div>
        </div>

        {/* Materia y Módulo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="materia">
              Materia
            </label>
            <select
              id="materia"
              name="materia"
              disabled={esDevolucion}
              value={idMateriaSeleccionada}
              onChange={e => setIdMateriaSeleccionada(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Seleccione una materia</option>
              {materias.map(m => (
                <option key={m.id_materia} value={m.id_materia}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="modulo">
              Módulo
            </label>
            <select
              type="number"
              disabled={esDevolucion}
              id="modulo"
              name="modulo"
              value={idModuloSeleccionado}
              onChange={e => setIdModuloSeleccionado(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Seleccione módulo</option>
              {[0, 1, 2, 3, 4, 5].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="semestre">
              Semestre
            </label>
            <select
              disabled={esDevolucion}
              id="semestre"
              name="semestre"
              value={idSemestreSeleccionada}
              onChange={e => setIdSemestreSeleccionada(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Seleccione módulo</option>
              {[1, 2].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha de entrega para préstamos, ambas fechas para devoluciones */}
        <div className="grid grid-cols-1 gap-6">
          {esDevolucion ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-semibold" htmlFor="fecha_prestamo">
                  Fecha y Hora de Préstamo
                </label>
                <input
                  type="text"
                  id="fecha_entrega"
                  value={formatearFechaUI()}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold" htmlFor="fecha_devolucion">
                  Fecha y Hora de Devolución
                </label>
                <input
                  type="text"
                  id="fecha_devolucion"
                  value={form.fecha_devolucion ? formatearFechaUI(form.fecha_devolucion) : formatearFechaUI()}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 cursor-not-allowed"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-semibold" htmlFor="fecha_entrega">
                Fecha y Hora de Entrega
              </label>
              <input
                type="text"
                id="fecha_entrega"
                value={formatearFechaUI()}
                readOnly
                className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 cursor-not-allowed"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="estado">
            Estado del Préstamo
          </label>
          {esDevolucion ? (
            <select
              id="estado"
              name="id_estado"
              value={form.id_estado}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Seleccione estado</option>
              {estadosPrestamo.map(e => (
                <option key={e.id_estado} value={e.id_estado}>{e.nombre}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={estadosPrestamo.find(e => e.id_estado.toString() === form.id_estado?.toString())?.nombre || 'Activo'}
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2.5 cursor-not-allowed"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="docente">
            Docente responsable
          </label>
          <select
            id="docente"
            name="docente"
            disabled={esDevolucion}
            value={idDocenteSeleccionado}
            onChange={e => setIdDocenteSeleccionado(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Seleccione un docente</option>
            {docentes.map(d => (
              <option key={d.id_docente} value={d.id_docente}>
                {d.persona.nombre} {d.persona.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="descripcion">
            {esDevolucion ? 'Descripción de Devolución' : 'Descripción del Préstamo'}
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            value={esDevolucion ? form.descripcion_devolucion : form.descripcion_prestamo}
            onChange={handleChange}
            
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
          />
        </div>

        {/* Detalles */}
        <div className="border-t pt-6 mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary)" }}>
              Detalles del préstamo
            </h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="codigo_material">
                  Código Material
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="codigo_material"
                    name="codigo_material"
                    onChange={handleDetalleChange}
                    value={nuevoDetalle.codigo_material}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    disabled={esDevolucion}
                    className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 text-sm border-gray-300 rounded-lg py-2.5 border focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    placeholder="Escanear código..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cantidad">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  min="1"
                  value={nuevoDetalle.cantidad}
                  onChange={handleDetalleChange}
                  disabled={esDevolucion}
                  className="focus:ring-red-500 focus:border-red-500 block w-full text-sm border-gray-300 rounded-lg py-2.5 px-3 border focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                type="button"
                onClick={agregarDetalle}
                disabled={esDevolucion}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Material
              </button>
            </div>
          </div>

          <div className='bg-white rounded-xl shadow overflow-hidden mt-6 border border-gray-100'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Código</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Nombre</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Especificaciones</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Cantidad</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Cantidad a Devolver</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {detalles.length === 0 ? (
                  <tr>
                    <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                      <div className='space-y-2'>
                        <p>No hay materiales registrados</p>
                      </div>
                    </td>
                  </tr>
                ) : detalles.filter(d => {
                  if (!searchTerm) return true;
                  const searchLower = searchTerm.toLowerCase();
                  return (
                    (d.codigo_material?.toLowerCase().includes(searchLower)) ||
                    (d.nombre?.toLowerCase().includes(searchLower)) ||
                    (d.especificaciones?.toLowerCase().includes(searchLower))
                  );
                }).length === 0 ? (
                  <tr>
                    <td colSpan='5' className='px-6 py-4 text-center text-gray-500'>
                      No se encontraron materiales que coincidan con la búsqueda
                    </td>
                  </tr>
                ) : (
                  detalles
                    .filter(d => {
                      if (!searchTerm) return true;
                      const searchLower = searchTerm.toLowerCase();
                      return (
                        (d.codigo_material?.toLowerCase().includes(searchLower)) ||
                        (d.nombre?.toLowerCase().includes(searchLower)) ||
                        (d.especificaciones?.toLowerCase().includes(searchLower))
                      );
                    })
                    .map((d, i) => (
                      <tr key={i} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {d.codigo_material}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {d.nombre}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {d.especificaciones}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {d.cantidad}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <div className='flex items-center space-x-2'>
                            <input
                              type='number'
                              disabled={!esDevolucion}
                              value={d.cantidad_devuelta ?? d.cantidad_prestada ?? d.cantidad}
                              onChange={(e) => {
                                const value = Math.min(
                                  parseInt(e.target.value) || 0,
                                  d.cantidad_prestada || d.cantidad
                                );
                                const updatedDetalles = [...detalles];
                                updatedDetalles[i] = {
                                  ...updatedDetalles[i],
                                  cantidad_devuelta: value
                                };
                                setDetalles(updatedDetalles);
                              }}
                              min='0'
                              max={d.cantidad_prestada || d.cantidad}
                              className='w-16 text-center border border-gray-300 rounded px-1 py-1'
                              required
                            />
                             {!esDevolucion && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedDetalles = [...detalles];
                                  updatedDetalles.splice(i, 1);
                                  setDetalles(updatedDetalles);
                                }}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Quitar material"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}  
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

            {/* Botón Guardar */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg"
              >
                {esDevolucion ? 'Registrar Devolución' : 'Registrar Préstamo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}