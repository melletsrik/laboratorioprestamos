import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function RegistrarUsuario() {
  const [p_nRegistro, setRegistro] = useState("");
  const [p_cNombre, setNombre] = useState("");
  const [p_cApellido, setApellido] = useState("");
  const [p_cNombreUsuario, setNombreUsuario] = useState("");
  const [p_cPassword, setPassword] = useState("");
  const [p_nRol, setRol] = useState(2); // 1=Admin, 2=Auxiliar
  const [cMensaje, setMensaje] = useState("");

  const f_registrar = async (e) => {
    e.preventDefault();

    if (![1, 2].includes(Number(p_nRol))) {
      setMensaje("El rol debe ser Administrador o Auxiliar.");
      return;
    }

    try {
      // Crear Persona
      const personaRes = await axios.post(
        "http://localhost:4000/personas/registrar-persona",
        {
          registro: p_nRegistro,
          nombre: p_cNombre,
          apellido: p_cApellido,
        }
      );

      const idPersona = personaRes.data.id_persona;

      // Crear Usuario
      await axios.post("http://localhost:4000/usuarios/registrar-usuario", {
        id_persona: idPersona,
        nombre_usuario: p_cNombreUsuario,
        password: p_cPassword,
        rol: Number(p_nRol),
      });

      setMensaje("Usuario registrado correctamente.");

      // Limpiar formulario
      setRegistro("");
      setNombre("");
      setApellido("");
      setNombreUsuario("");
      setPassword("");
      setRol(2);
    } catch (error) {
      console.error(error);
      setMensaje("Error al registrar el usuario.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="w-1/2 text-white flex items-center justify-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="text-center space-y-2">
          <p className="font-bold text-lg">REGISTRAR USUARIO</p>
        </div>
      </div>

      <div className="w-1/2 bg-white flex items-center justify-center px-6">
        <form onSubmit={f_registrar} className="w-full max-w-sm space-y-4">
          <div className="flex flex-col items-center mb-2">
            <img src={logo} alt="Logo" className="h-32 mb-2" />
          </div>

          {cMensaje && (
            <p
              className={`text-sm text-center ${
                cMensaje.includes("correctamente")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {cMensaje}
            </p>
          )}

          <div>
            <label className="block font-semibold">Registro</label>
            <input
              type="number"
              value={p_nRegistro}
              onChange={(e) => setRegistro(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              value={p_cNombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Apellido</label>
            <input
              type="text"
              value={p_cApellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Nombre de Usuario</label>
            <input
              type="text"
              value={p_cNombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Contraseña</label>
            <input
              type="password"
              value={p_cPassword}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Rol</label>
            <select
              value={p_nRol}
              onChange={(e) => setRol(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value={1}>Administrador</option>
              <option value={2}>Auxiliar</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="text-white px-6 py-2 rounded-md"
              style={{ backgroundColor: "var(--color-primary)", 
                hover: "var(--color-secondary)"
              }}
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
