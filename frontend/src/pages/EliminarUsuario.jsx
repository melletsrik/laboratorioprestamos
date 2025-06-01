import { useEffect, useState } from "react";
import axios from "axios";

export default function EliminarUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/usuarios").then((res) => setUsuarios(res.data));
  }, []);

  const eliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      setMensaje("Usuario eliminado.");
    } catch {
      setMensaje("Error al eliminar.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Eliminar Usuarios</h2>
      {mensaje && <p className="text-red-600 mb-2">{mensaje}</p>}
      <ul className="space-y-2">
        {usuarios.map((u) => (
          <li key={u.id_usuario} className="flex justify-between items-center border p-2 rounded">
            <span>{u.nombre_usuario} ({u.rol})</span>
            <button onClick={() => eliminar(u.id_usuario)} className="text-white px-4 py-1 rounded" style={{ backgroundColor: "var(--color-primary)" }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
