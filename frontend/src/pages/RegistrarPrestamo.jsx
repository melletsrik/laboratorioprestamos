import React, { useState, useEffect } from "react";

const estadosPrestamo = [
  { id_estado: 1, nombre: "Activo" },
  { id_estado: 3, nombre: "Devuelto" }
];

export default function RegistroPrestamo() {
  const [form, setForm] = useState({
    registro: "",
    nombres: "",
    apellidos: "",
    asistente_entrega: "",
    asistente_recepcion: "",
    materia: "",
    modulo: "",
    descripcion: "",
    id_estado: "1",
  });

  const [detalles, setDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_material: "",
    codigo_material: "",
    nombre: "",
    especificaciones: "",
    cantidad: 1,
  });
  const [fechaHoraActual, setFechaHoraActual] = useState("");
  const [codigoEscaneado, setCodigoEscaneado] = useState("");
  const [estudianteNoEncontrado, setEstudianteNoEncontrado] = useState(false);
  const [idEstudiantesMateria, setIdEstudiantesMateria] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [idDocenteMateriaSeleccionado, setIdDocenteMateriaSeleccionado] = useState(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState(null);

  // Fecha y hora actual
  useEffect(() => {
    const now = new Date();
    const fechaHora = now.toISOString().slice(0, 19).replace("T", " ");
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
      return data.data; // { id_estudiante, persona: { nombre, apellido, ... } }
    }
    return null;
  }

  async function obtenerInscripciones(id_estudiante) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api/estudiantes/${id_estudiante}/materias`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data; // Array de inscripciones
    }
    return [];
  }

  const inscripcion = inscripciones.find(m =>
    m.id_docente_materia === idDocenteMateriaSeleccionado &&
    m.id_modulo === moduloSeleccionado &&
    m.id_semestre === semestreSeleccionado
  );
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

          // Buscar inscripciones
          obtenerInscripciones(estudiante.id_estudiante).then(insc => {
            setInscripciones(insc);
          });
        } else {
          setForm(prev => ({
            ...prev,
            nombres: "",
            apellidos: "",
          }));
          setIdEstudiante(null);
          setInscripciones([]);
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
      setInscripciones([]);
      setEstudianteNoEncontrado(false);
    }
  }, [form.registro]);

  
  useEffect(() => {
  if (inscripciones.length > 0 && form.materia && form.modulo) {
    // Aquí debes tener los valores correctos para comparar
    const insc = inscripciones.find(m =>
      m.docente_materia?.materia?.nombre === form.materia &&
      m.id_modulo === Number(form.modulo)
      // Puedes agregar semestre si lo manejas
    );
    setIdEstudiantesMateria(insc ? insc.id_estudiantes_materia : null);
  } else {
    setIdEstudiantesMateria(null);
  }
}, [inscripciones, form.materia, form.modulo]);

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
      setForm({
        ...prestamoADevolver,
        asistente_entrega: prestamoADevolver.asistente_entrega || "",
        asistente_recepcion: usuario.nombre + " " + usuario.apellido,
      });
      setDetalles(prestamoADevolver.detalles || []);
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Buscar material por código
  async function buscarMaterialPorCodigo(codigo) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api/materiales/${codigo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (data.success) {
      return data.data; // El material encontrado
    }
    return null;
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

  // Manejar input del escaneo simulado
  function handleScanInputChange(e) {
    setCodigoEscaneado(e.target.value);
  }

  // Simular escaneo de código de barras
  async function handleSimularEscaneo(e) {
    e.preventDefault();
    const material = await buscarMaterialPorCodigo(codigoEscaneado);
    if (material) {
      setNuevoDetalle({
        id_material: material.id_material,
        codigo_material: material.codigo_material,
        nombre: material.nombre,
        especificaciones: material.especificaciones,
        cantidad: 1
      });
      setCodigoEscaneado("");
    } else {
      alert("Material no encontrado");
    }
  }

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

    // Validar que haya un idEstudiantesMateria seleccionado
    if (!idEstudiantesMateria) {
      alert("Selecciona una materia y módulo válidos para el estudiante.");
      return;
    }

    const token = localStorage.getItem("token");
    const prestamoData = {
      id_estudiantes_materia: idEstudiantesMateria,
      asistente_entrega: form.asistente_entrega,
      asistente_recepcion: form.asistente_recepcion,
      descripcion: form.descripcion,
      fecha_prestamo: fechaHoraActual,
      id_estado: form.id_estado,
      detalles,
    };
    try {
      const res = await fetch("http://localhost:4000/api/prestamos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prestamoData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Préstamo registrado exitosamente.");
        // Limpiar formulario si no es devolución
        if (!esDevolucion) {
          setForm(prev => ({
            ...prev,
            registro: "",
            nombres: "",
            apellidos: "",
            materia: "",
            modulo: "",
            descripcion: "",
            id_estado: "1",
          }));
          setDetalles([]);
          setNuevoDetalle({
            id_material: "",
            codigo_material: "",
            nombre: "",
            especificaciones: "",
            cantidad: 1,
          });
        } else {
          localStorage.removeItem("prestamoADevolver");
        }
      } else {
        alert(data.error || "Error al registrar el préstamo.");
      }
    } catch (err) {
      alert("Error de red al registrar el préstamo.");
    }
  }

  const params = new URLSearchParams(window.location.search);
  const esDevolucion = params.get("devolucion") === "1";

  return (
    <div className="max-w-4xl mx-auto p-6" style={{ color: "var(--color-black)" }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>
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
              onChange={handleChange}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="materia">
              Materia
            </label>
            <input
              type="text"
              id="materia"
              name="materia"
              value={form.materia}
              onChange={handleChange}
              readOnly={esDevolucion}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold" htmlFor="modulo">
              Módulo
            </label>
            <input
              type="text"
              id="modulo"
              name="modulo"
              value={form.modulo}
              onChange={handleChange}
              readOnly={esDevolucion}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            />
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

        <label>Estado del préstamo</label>
        <select
          name="id_estado"
          value={form.id_estado}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione estado</option>
          {estadosPrestamo.map(e => (
            <option key={e.id_estado} value={e.id_estado}>{e.nombre}</option>
          ))}
        </select>

        {/* Descripción */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            value={form.descripcion}
            onChange={handleChange}
            readOnly={esDevolucion}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
          />
        </div>

        {/* Detalles */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--color-primary)" }}>
            Detalles del préstamo
          </h2>
          <div className="mb-4">
            <label className="block mb-1 font-semibold" htmlFor="codigoEscaneado">
              Simular escaneo de código de barras
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="codigoEscaneado"
                value={codigoEscaneado}
                onChange={handleScanInputChange}
                placeholder="Ej: MAT-001"
                className="border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={handleSimularEscaneo}
                style={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)" }}
                className="rounded px-4 py-2 font-semibold hover:opacity-90 transition"
              >
                Simular escaneo
              </button>
            </div>
          </div>
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
                onChange={handleDetalleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
                required
              />
            </div>
            <button
              type="button"
              onClick={agregarDetalle}
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