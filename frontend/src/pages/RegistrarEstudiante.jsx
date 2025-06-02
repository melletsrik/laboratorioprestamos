import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function RegistrarEstudiante() {
  const [registro, setRegistro] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [mensaje, setMensaje] = useState("");
  const registrar = async (e) => {
    e.preventDefault();
    try {
      const persona = await axios.post("http://localhost:3000/api/persona", {
        registro,
        nombre,
        apellido,
      });
      await axios.post("http://localhost:3000/api/estudiante", {
        id_persona: persona.data.id_persona,
      });
      setMensaje("Estudiante registrado exitosamente.");
      setRegistro("");
      setNombre("");
      setApellido("");
    } catch (err) {
      setMensaje("Error al registrar el estudiante.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 text-white flex items-center justify-center" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="text-center space-y-2">
          <p className="font-bold text-lg">REGISTRAR ESTUDIANTE</p>
        </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center px-6">
        <form onSubmit={registrar} className="w-full max-w-sm space-y-5">
          <div className="flex flex-col items-center mb-2">
            <img src={logo} alt="Logo" className="h-40 mb-2" />
          </div>
          {mensaje && <p className="text-sm text-center text-red-600">{mensaje}</p>}
          <input type="text" placeholder="Registro" value={registro} onChange={(e) => setRegistro(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required className="w-full px-4 py-2 border rounded-md" />
          <button type="submit" className="w-full py-2 text-white font-bold rounded-md" style={{ backgroundColor: "var(--color-primary)" }}>
            REGISTRAR
          </button>
        </form>
      </div>
    </div>
  );
}
    