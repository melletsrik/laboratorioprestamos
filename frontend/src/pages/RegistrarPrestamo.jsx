import React, { useState, useEffect } from "react";

const datosSimulados = {
  "12345": { nombres: "Juan", apellidos: "Pérez" },
  "67890": { nombres: "María", apellidos: "González" },
  // Agrega más registros simulados si quieres
};

export default function RegistroPrestamo() {
  const [form, setForm] = useState({
    registro: "",
    nombres: "",
    apellidos: "",
    asistente: "",
    materia: "",
    modulo: "",
    descripcion: "",
  });

  const [detalles, setDetalles] = useState([]);

  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_material: "",
    cantidad: 1,
  });

  // Fecha y hora actual para mostrar
  const [fechaHoraActual, setFechaHoraActual] = useState("");

  useEffect(() => {
    const now = new Date();
    // Formatear como YYYY-MM-DD HH:mm:ss
    const fechaHora = now.toISOString().slice(0, 19).replace("T", " ");
    setFechaHoraActual(fechaHora);
  }, []);

  // Cuando cambia el registro, buscar nombres y apellidos simulados
  useEffect(() => {
    if (form.registro in datosSimulados) {
      setForm((prev) => ({
        ...prev,
        nombres: datosSimulados[form.registro].nombres,
        apellidos: datosSimulados[form.registro].apellidos,
      }));
    } else {
      setForm((prev) => ({ ...prev, nombres: "", apellidos: "" }));
    }
  }, [form.registro]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDetalleChange(e) {
    const { name, value } = e.target;
    setNuevoDetalle((prev) => ({
      ...prev,
      [name]: name === "cantidad" ? Number(value) : value,
    }));
  }

  function agregarDetalle() {
    if (!nuevoDetalle.id_material) {
      alert("Debe ingresar un ID de material.");
      return;
    }
    setDetalles((prev) => [...prev, nuevoDetalle]);
    setNuevoDetalle({ id_material: "", cantidad: 1 });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Aquí agregaríamos fechaHoraActual al registro del préstamo, ya que es la fecha y hora real

    const prestamoData = {
      ...form,
      fecha_prestamo: fechaHoraActual,
      estado: "pendiente",
      detalles,
    };

    console.log("Datos del préstamo a enviar:", prestamoData);
    alert("Préstamo registrado (simulado).");
  }

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
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
              required
            />
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

        {/* Asistente que entrega */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="asistente">
            Asistente que entrega
          </label>
          <input
            type="text"
            id="asistente"
            name="asistente"
            value={form.asistente}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-var(--color-primary)"
            required
          />
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
              <label className="block mb-1 font-semibold" htmlFor="id_material">
                ID Material
              </label>
              <input
                type="text"
                id="id_material"
                name="id_material"
                value={nuevoDetalle.id_material}
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
                <th className="border border-gray-300 px-4 py-2 text-left">ID Material</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center p-4 text-gray-500">
                    No hay materiales agregados
                  </td>
                </tr>
              )}
              {detalles.map((detalle, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{detalle.id_material}</td>
                  <td className="border border-gray-300 px-4 py-2">{detalle.cantidad}</td>
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
