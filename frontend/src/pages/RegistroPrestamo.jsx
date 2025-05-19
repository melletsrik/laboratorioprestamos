import { useEffect, useState } from "react";
import axios from "axios";

import logo from "../assets/logo.png";

export default function RegistroPrestamo() {
  const [asistentes, setAsistentes] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materiales, setMateriales] = useState([]);

  const [idEntrega, setIdEntrega] = useState("");
  const [idRecepcion, setIdRecepcion] = useState("");
  const [idEstudiante, setIdEstudiante] = useState("");
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [observaciones, setObservaciones] = useState("");

  const agregarMaterial = (id) => {
    const existe = materialesSeleccionados.find((m) => m.id_material === id);
    if (!existe) {
      setMaterialesSeleccionados([
        ...materialesSeleccionados,
        { id_material: id, cantidad: 1 },
      ]);
    }
  };

  const cambiarCantidad = (id, cantidad) => {
    setMaterialesSeleccionados((prev) =>
      prev.map((m) =>
        m.id_material === id ? { ...m, cantidad } : m
      )
    );
  };

  const quitarMaterial = (id) => {
    setMaterialesSeleccionados((prev) =>
      prev.filter((m) => m.id_material !== id)
    );
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/prestamos", {
        id_asistente_entrega: idEntrega,
        id_asistente_recepcion: idRecepcion,
        id_estudiante: idEstudiante,
        observaciones,
        materiales: materialesSeleccionados,
      });
      alert("Préstamo registrado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al registrar el préstamo.");
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const [resAsistentes, resEstudiantes, resMateriales] = await Promise.all([
        axios.get("http://localhost:3000/api/asistentes"),
        axios.get("http://localhost:3000/api/estudiantes"),
        axios.get("http://localhost:3000/api/materiales"),
      ]);
      setAsistentes(resAsistentes.data);
      setEstudiantes(resEstudiantes.data);
      setMateriales(resMateriales.data);
    };
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto bg-gray-100 shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-primary">Registrar Préstamo</h1>
                      <img src={logo} alt="Logo" className="h-20 mb-2" />
        </div>

        <form onSubmit={enviarFormulario} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asistente que entrega
              </label>
              <select
                required
                value={idEntrega}
                onChange={(e) => setIdEntrega(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">-- Seleccione --</option>
                {asistentes.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asistente que recepciona
              </label>
              <select
                required
                value={idRecepcion}
                onChange={(e) => setIdRecepcion(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">-- Seleccione --</option>
                {asistentes.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estudiante
            </label>
            <select
              required
              value={idEstudiante}
              onChange={(e) => setIdEstudiante(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Seleccione --</option>
              {estudiantes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.codigo} - {e.nombres} {e.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Materiales
            </label>
            <div className="grid grid-cols-2 gap-2">
              {materiales.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => agregarMaterial(m.id)}
                  className="bg-secondary text-black rounded px-2 py-1 hover:bg-gray-400"
                >
                  {m.nombre}
                </button>
              ))}
            </div>

            {materialesSeleccionados.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-1">Seleccionados:</h3>
                {materialesSeleccionados.map((m) => {
                  const material = materiales.find((mat) => mat.id === m.id_material);
                  return (
                    <div
                      key={m.id_material}
                      className="flex items-center justify-between border p-2 rounded mb-2"
                    >
                      <span>{material?.nombre}</span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={m.cantidad}
                          min={1}
                          className="w-16 border rounded px-2"
                          onChange={(e) =>
                            cambiarCantidad(m.id_material, parseInt(e.target.value, 10))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => quitarMaterial(m.id_material)}
                          className="text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-red-700 font-semibold"
            >
              Registrar préstamo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
