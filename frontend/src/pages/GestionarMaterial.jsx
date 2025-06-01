import { useState, useEffect } from "react";
import axios from "axios";

export default function GestionarMaterial() {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [materiales, setMateriales] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarMateriales();
  }, []);

  const cargarMateriales = async () => {
    const res = await axios.get("http://localhost:3000/api/materiales");
    setMateriales(res.data);
  };

  const agregar = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/materiales", {
        codigo_material: codigo,
        nombre_material: nombre,
        cantidad,
      });
      setMensaje("Material agregado.");
      setCodigo("");
      setNombre("");
      setCantidad("");
      cargarMateriales();
    } catch {
      setMensaje("Error al agregar material.");
    }
  };

  const eliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/materiales/${id}`);
      cargarMateriales();
      setMensaje("Material eliminado.");
    } catch {
      setMensaje("Error al eliminar.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={agregar} className="space-y-2">
        <h2 className="text-xl font-bold">Agregar Material</h2>
        <input type="number" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código" required className="w-full px-4 py-2 border rounded-md" />
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-2 border rounded-md" />
        <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" required className="w-full px-4 py-2 border rounded-md" />
        <button type="submit" className="w-full py-2 text-white font-bold rounded-md" style={{ backgroundColor: "var(--color-primary)" }}>
          AGREGAR
        </button>
        {mensaje && <p className="text-red-600">{mensaje}</p>}
      </form>

      <div>
        <h3 className="text-lg font-semibold">Materiales Registrados</h3>
        <ul className="space-y-2 mt-2">
          {materiales.map((m) => (
            <li key={m.id_material} className="flex justify-between items-center border p-2 rounded">
              <span>{m.nombre_material} - {m.cantidad}</span>
              <button onClick={() => eliminar(m.id_material)} className="text-white px-4 py-1 rounded" style={{ backgroundColor: "var(--color-primary)" }}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
