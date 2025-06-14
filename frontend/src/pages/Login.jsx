import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navegar = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          nombreUsuario,
          password: contrasena,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (respuesta.data.token && respuesta.data.usuario) {
        // Guardar token y datos de usuario
        localStorage.setItem("token", respuesta.data.token);
        localStorage.setItem("user", JSON.stringify(respuesta.data.usuario));

        // Redirigir según el rol
        if (respuesta.data.usuario.rol === "Administrativo") {
          navegar("/menu-admin");
        } else if (respuesta.data.usuario.rol === "Auxiliar") {
          navegar("/menu-aux");
        } else {
          // Rol no reconocido
          setError("No tienes permisos para acceder al sistema");
          localStorage.clear();
        }
      }
    } catch (error) {
      setError("Usuario o contraseña incorrectos");
      console.error("Error en login:", error);
      localStorage.clear();
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="w-1/2 text-white flex items-center justify-center"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="text-center space-y-2">
          <p className="font-bold text-lg">LABORATORIO DE ELECTRONICA</p>
        </div>
      </div>

      <div className="w-1/2 bg-white flex items-center justify-center px-6">
        <form onSubmit={iniciarSesion} className="w-full max-w-sm space-y-5">
          <div className="flex flex-col items-center mb-2">
            <img src={logo} alt="Logo" className="h-40 mb-2" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label className="text-sm font-semibold text-gray-800">
              USUARIO
            </label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-800">
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <button
            type="submit"
            style={{ backgroundColor: "var(--color-primary)" }}
            className="w-full py-2 hover:brightness-90 text-white font-bold rounded-md"
          >
            INICIAR SESIÓN
          </button>
        </form>
      </div>
    </div>
  );
}