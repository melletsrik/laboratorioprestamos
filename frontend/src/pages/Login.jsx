import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo2 from "../assets/logo2.png";
import Button from "../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
         localStorage.setItem("rol", respuesta.data.usuario.rol);

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
    <div className="flex min-h-screen  bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="w-2/5 text-white flex items-center justify-center " style={{ backgroundColor: "var(--color-primary)" }}  >
        <div className="text-center space-y-2">
          <img src={logo2} alt="logo2" className="h-40 w-auto mb-4 absolute top-[36%]  left-[4%] " /> 
          <p className="text-2xl font-[Gloria_Hallelujah] absolute top-[54%] left-[15%]">   ¡Lo que tu quieras ser!</p>
        </div>
      </div>

      <div className="w-3/5 bg-white flex items-center justify-center px-16 py-12">
        <form onSubmit={iniciarSesion} className="w-full max-w-sm space-y-6">

          <div className="text-center mb-17 ">
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Bienvenido
              </h2>
              <p className="text-gray-600 text-2xl">
                LABORATORIO DE ELECTRÓNICA
              </p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div > 
            <label className=" block text-base font-semibold not-italic text-gray-800  mb-2  ">
              USUARIO
            </label>
            <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} placeholder="Ingresa tu usuario" className="w-full px-4 py-2.5 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-100 transition pr-12" style={{ borderColor: "var(--color-primary)" }} required
            />
          </div>

          <div>
            <label className="block text-base font-semibold not-italic text-gray-800 mb-2 ">
              CONTRASEÑA
            </label>
            <div className="relative">
              <input
              type={showPassword ? <FaEyeSlash  className="h-5 w-5" /> : <FaEye className="h-5 w-5" />} placeholder="Ingresa tu contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="w-full px-4 py-2.5 mt-1 border rounded-md  focus:outline-none focus:ring-2 focus:ring-red-100 transition pr-12" style={{ borderColor: "var(--color-primary)" }} required
            />
            <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-400"
    >
      {showPassword ? (
        <FaEyeSlash className="h-5 w-5" />
      ) : (
        <FaEye className="h-5 w-5" />
      )}
    </button>
            </div>
          </div>

          <Button type="submit" style={{ backgroundColor: "var(--color-primary)" }} onClick={() => setShowPassword(!showPassword)} 
            className=" px-6 py-2 hover:brightness-90 text-white font-semibold rounded-md shadow-md transition duration-300"
          >
            INICIAR SESIÓN
          </Button>
        </form>
      </div>
    </div>
  );
}