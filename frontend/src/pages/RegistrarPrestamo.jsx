import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../utils/auth";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
const estadosPrestamo = [
  { id_estado: 1, nombre: "Activo" },
  { id_estado: 3, nombre: "Devuelto" }
];

export default function RegistroPrestamo() {
  const token = Auth.getToken();
  const navegar = useNavigate();
  const [form, setForm] = useState({
    registro: "",
    nombres: "",
    apellidos: "",
    asistente_entrega: "",
    asistente_recepcion: "",
    observaciones: "",
    id_estado: "1",
  });

  const [detalles, setDetalles] = useState([]);
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

  // Fecha y hora actual
  useEffect(() => {
    const now = new Date();
    const fechaHora = now.toISOString().replace('T', ' ').slice(0, -5);
    setFechaHoraActual(fechaHora);
  }, []);

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
    const params = new URLSearchParams(window.location.search);
    const esDevolucion = params.get("devolucion") === "1";
    const prestamoADevolver = JSON.parse(localStorage.getItem("prestamoADevolver"));
    const usuario = JSON.parse(localStorage.getItem("user"));
    if (esDevolucion && prestamoADevolver && usuario) {
      setForm(prev => ({
        ...prev,
        registro: prestamoADevolver.registro || "",
        nombres: prestamoADevolver.nombres || "",
        apellidos: prestamoADevolver.apellidos || "",
        asistente_entrega: prestamoADevolver.asistente_entrega || "",
        asistente_recepcion: usuario.nombre + " " + usuario.apellido,
        observaciones: prestamoADevolver.observaciones || "",
        
        // NO establecemos id_estado, lo dejamos como estaba o que el usuario lo elija
      }));
      setDetalles(prestamoADevolver.detalles || []);
      setIdMateriaSeleccionada(prestamoADevolver.id_materia?.toString() || "");
      setIdModuloSeleccionado(prestamoADevolver.id_modulo?.toString() || "");
      setIdSemestreSeleccionada(prestamoADevolver.id_semestre?.toString() || "");
      setIdDocenteSeleccionado(prestamoADevolver.id_docente?.toString() || "");
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    const esDevolucion = new URLSearchParams(window.location.search).get("devolucion") === "1";
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
    try {
      const token = Auth.getToken();
      const res = await fetch(`http://localhost:4000/api/materiales/${codigo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Error buscando material:', error);
      return null;
    }
  }

  // Manejar cambios en los detalles del material
  function handleDetalleChange(e) {
    const { name, value } = e.target;
    let nuevo = { ...nuevoDetalle, [name]: name === "cantidad" ? Number(value) : value };
    if (name === "codigo_material") {
      buscarMaterialPorCodigo(value).then(material => {
        if (material) {
          setNuevoDetalle({
            ...nuevo,
            id_material: material.id_material,
            codigo_material: material.codigo_material,
            nombre: material.nombre,
            especificaciones: material.especificaciones,
          });
        } else {
          setNuevoDetalle({
            ...nuevo,
            id_material: "",
            nombre: "",
            especificaciones: "",
          });
        }
      });
    } else {
      setNuevoDetalle(nuevo);
    }
  }

  // Manejar escaneo de código de barras desde teclado
  useEffect(() => {
    const handleKeyPress = async (e) => {
      // Solo procesar si el input de código está en foco
      if (document.activeElement.name === 'codigo_material') {
        // Limpiar el timeout anterior si existe
        if (ultimoTimeout) {
          clearTimeout(ultimoTimeout);
        }

        // Establecer nuevo timeout
        const timeout = setTimeout(async () => {
          const codigo = document.activeElement.value;
          
          // Verificar si el código tiene al menos 8 caracteres
          if (codigo.length >= 8) {
            setIsLoading(true);
            try {
              const material = await buscarMaterialPorCodigo(codigo);
              if (material) {
                setNuevoDetalle({
                  id_material: material.id_material,
                  codigo_material: material.codigo_material,
                  nombre: material.nombre,
                  especificaciones: material.especificaciones,
                  cantidad: 1
                });
                document.activeElement.value = ""; // Limpiar el input
              } else {
                alert("Material no encontrado");
              }
            } catch (error) {
              console.error('Error buscando material:', error);
              alert('Error al buscar el material');
            } finally {
              setIsLoading(false);
            }
          }
        }, 200); // Aumentamos el delay a 200ms para mayor precisión

        setUltimoTimeout(timeout);
      }
    };

    // Agregar el listener de eventos
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [ultimoTimeout]);

  // Agregar detalle a la lista
  function agregarDetalle() {
    if (
      !nuevoDetalle.id_material ||
      !nuevoDetalle.codigo_material ||
      !nuevoDetalle.nombre ||
      !nuevoDetalle.especificaciones ||
      !nuevoDetalle.cantidad ||
      nuevoDetalle.cantidad < 1
    ) {
      alert("Completa todos los campos del material antes de agregar.");
      return;
    }
    setDetalles((prev) => {
      const idx = prev.findIndex(
        (d) => d.id_material === nuevoDetalle.id_material
      );
      if (idx !== -1) {
        const actualizados = [...prev];
        actualizados[idx].cantidad += nuevoDetalle.cantidad;
        return actualizados;
      }
      return [...prev, nuevoDetalle];
    });
    setNuevoDetalle({
      id_material: "",
      codigo_material: "",
      nombre: "",
      especificaciones: "",
      cantidad: 1,
      descripcion_devolucion: ""
    });
  }

  // Enviar formulario
  async function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const esDevolucion = params.get("devolucion") === "1";

    // Validar que haya al menos un material
    if (!detalles.length) {
      alert("Agrega al menos un material al préstamo.");
      return;
    }

    // Validar que se haya encontrado un estudiante
    if (!idEstudiante) {
      alert("Debes buscar y seleccionar un estudiante válido antes de registrar el préstamo.");
      return;
    }

    //Validar que se haya seleccionado un docente
    if (!idDocenteSeleccionado) {
      alert("Debes seleccionar el docente responsable.");
      return;
    }

    // Validar que los campos manuales estén completos
    if (!idMateriaSeleccionada || !idModuloSeleccionado || !idSemestreSeleccionada) {
      alert("Completa todos los campos de materia, módulo y semestre.");
      return;
    }

    // Obtener el usuario logueado desde localStorage
    const usuario = JSON.parse(localStorage.getItem("user"));
    const idUsuarioEntrega = usuario && usuario.id ? usuario.id : null;
    const token = localStorage.getItem("token");

    if (!idUsuarioEntrega) {
      alert("No se pudo obtener el usuario que entrega el préstamo.");
      return;
    }
    const prestamoData = {
      id_estudiante: idEstudiante,
      id_materia: idMateriaSeleccionada,
      id_modulo: idModuloSeleccionado,
      id_semestre: idSemestreSeleccionada,
      id_usuario_entrega: idUsuarioEntrega,
      id_usuario_recibe: null, // Puedes actualizar esto si tienes lógica de recepción
      fecha_prestamo: fechaHoraActual,
      id_estado: form.id_estado,
      id_docente: idDocenteSeleccionado,
      observaciones: form.observaciones,
      detalles,
    };
    try {
      let res;
      let data;

      if (esDevolucion) {
        const prestamoADevolver = JSON.parse(localStorage.getItem("prestamoADevolver"));
        const idPrestamo = prestamoADevolver?.id_prestamo;
        if (!idPrestamo) {
          alert("No se encontró el ID del préstamo a devolver.");
          return;
        }

        // Prepara los detalles para devolución
        const detallesDevolucion = detalles.map((detalle) => ({
          id_detalle_prestamo: detalle.id_detalle_prestamo,
          cantidad_devuelta: detalle.cantidad_devuelta || detalle.cantidad,
          descripcion_devolucion: detalle.descripcion_devolucion || ''
        }));

        // Tomar la observación anterior y agregar la nueva descripción de devolución
        const descripcionDevolucion = form.descripcion_devolucion?.trim();
        const observacionAnterior = prestamoADevolver?.observaciones || "";
        const observacionesCompletas = [
        observacionAnterior.trim(),
        descripcionDevolucion ? `[Devolución] ${descripcionDevolucion}` : null
].filter(Boolean).join('\n');

// Armar el objeto final
const devolucionData = {
  id_usuario_recibe: usuario.id,
  detalles: detallesDevolucion,
  observaciones: observacionesCompletas
};


        res = await fetch(`http://localhost:4000/api/prestamos/${idPrestamo}/devolver`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(devolucionData),
        });
        data = await res.json();
      } else {
        // flujo normal para registrar préstamo
        res = await fetch("http://localhost:4000/api/prestamos", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prestamoData),
        });
        data = await res.json();
      }
      console.log("Respuesta del backend:", data);

      if (data.success) {
        if (esDevolucion) {
          alert("Devolución registrada exitosamente.");
          window.location.href = "/prestamo-activos";
        } else {
          alert("Préstamo registrado exitosamente.");

          setForm(prev => ({
            ...prev,
            registro: "",
            nombres: "",
            apellidos: "",
            observaciones: "",
            id_estado: "1",
          }));
          setDetalles([]);
          setNuevoDetalle({
            id_material: "",
            codigo_material: "",
            nombre: "",
            especificaciones: "",
            cantidad: 1,
            descripcion_devolucion: ""
          });
          setIdMateriaSeleccionada("");
          setIdModuloSeleccionado("");
          setIdSemestreSeleccionada("");
        }
      } else {
        console.error("Error del backend:", data);
        alert(`Error al registrar el préstamo:\n${data.error || JSON.stringify(data)}`);
      }
    } catch (err) {
      alert("Error de red al registrar el préstamo.");
    }
  }

  const params = new URLSearchParams(window.location.search);
  const esDevolucion = params.get("devolucion") === "1";
  return (
    <div className="bg-gray-50 min-h-screen px-7  max-w-4xl mx-auto " style={{ color: "var(--color-black)" }}>
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
      <h1 className="text-3xl font-bold text-white tracking-wide" style={{ color: "var(--color-primary)" }}>
        Registrar Préstamo
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
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
              className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
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
              className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
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
              className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
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
              readOnly
              className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
              required
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
              className="w-full border border-gray-300 rounded px-3 py-2"
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
              className="w-full border border-gray-300 rounded px-3 py-2"
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
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Seleccione módulo</option>
              {[1, 2].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fecha y hora actual (solo lectura) */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="fechaHora">
            Fecha y hora de préstamo
          </label>
          <input
            type="text"
            id="fechaHora"
            value={fechaHoraActual}
            readOnly
            className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2 cursor-not-allowed"
          />
        </div>

        <label className="px-3">Estado del Préstamo</label>
        <select
          name="id_estado"
          value={form.id_estado}
          onChange={handleChange}
          required
          className="w-30 border border-gray-300 rounded px-3 py-2 "
        >
          <option value="">Seleccione estado</option>
          {estadosPrestamo.map(e => (
            <option key={e.id_estado} value={e.id_estado}>{e.nombre}</option>
          ))}
        </select>

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
            className="w-full border border-gray-300 rounded px-3 py-2"
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
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--color-primary)" }}>
            Detalles del préstamo
          </h2>

          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 font-semibold" htmlFor="codigo_material">
                Código Material
              </label>
              <input
                type="text"
                id="codigo_material"
                name="codigo_material"
                value={nuevoDetalle.codigo_material}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Evita que se envíe el formulario al escanear
                  }
                }}
                disabled={esDevolucion}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
                placeholder="Escanear código de barras..."
              />
            </div>
            <div className="w-24">
              <label className="block mb-1 font-semibold" htmlFor="cantidad">
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
                required
              />
            </div>
            <button
              type="button"
              onClick={agregarDetalle}
              disabled={esDevolucion}
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)" }}
              className="rounded px-5 py-2 font-semibold hover:opacity-90 transition"
            >
              Agregar
            </button>
          </div>

          <table className="w-full mt-6 border border-gray-300 rounded">
            <thead style={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)" }}>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Código</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Especificaciones</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Cantidad a Devolver</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No hay materiales agregados
                  </td>
                </tr>
              )}
              {detalles.map((d, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{d.codigo_material}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.nombre}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.especificaciones}</td>
                  <td className="border border-gray-300 px-4 py-2">{d.cantidad}</td>
                  <td className="border border-gray-300 px-4 py-2">
            <input
              type="number"
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
              min="0"
              max={d.cantidad_prestada || d.cantidad}
              className="w-full border rounded p-1 text-center"
              required
            />
          </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón Guardar */}
        <div className="mt-6">
          <button
            type="submit"
            style={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)" }}
            className="rounded px-8 py-3 font-semibold hover:opacity-90 transition"
          >
            Registrar Préstamo
          </button>
        </div>
      </form>
    </div>
  );
}