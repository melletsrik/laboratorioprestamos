import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function RegistrarUsuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("estudiante"); // valores: estudiante, auxiliar, docente
  const [mensaje, setMensaje] = useState("");

  const registrar = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post("http://localhost:4000/api/usuarios", {
        nombre,
        correo,
        contrasena,
        rol,
      });
      setMensaje("Usuario registrado correctamente.");
      setNombre("");
      setCorreo("");
      setContrasena("");
      setRol("estudiante");
    } catch (err) {
      setMensaje("Hubo un error al registrar el usuario.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel rojo izquierdo */}
      <div
        className="w-1/2 text-white flex items-center justify-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="text-center space-y-2">
          <p className="font-bold text-lg">REGISTRAR USUARIO</p>
        </div>
      </div>

      {/* Panel blanco derecho */}
      <div className="w-1/2 bg-white flex items-center justify-center px-6">
        <form onSubmit={registrar} className="w-full max-w-sm space-y-5">
          <div className="flex flex-col items-center mb-2">
            <img src={logo} alt="Logo" className="h-40 mb-2" />
          </div>

          {mensaje && <p className="text-sm text-center text-red-600">{mensaje}</p>}

          <div>
            <label className="text-sm font-semibold text-gray-800">NOMBRE</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">CORREO</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">CONTRASEÑA</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">ROL</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <option value="estudiante">Estudiante</option>
              <option value="auxiliar">Auxiliar</option>
              <option value="docente">Docente</option>
            </select>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full py-2 hover:brightness-90 text-white font-bold rounded-md"
          >
            REGISTRAR
          </button>
        </form>
      </div>
    </div>
  );
}
