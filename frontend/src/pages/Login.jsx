import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [cEmail, setEmail] = useState("");
  const [cPassword, setPassword] = useState("");
  const [cError, setError] = useState("");
  const navigate = useNavigate();

  const f_handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email: cEmail,
        password: cPassword,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel rojo izquierdo */}
      <div className="w-1/2 bg-primary text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-bold text-lg">LABORATORIO</p>
          <p className="font-bold text-lg">DE</p>
          <p className="font-bold text-lg">ELECTRONICA</p>
        </div>
      </div>

      {/* Panel blanco derecho */}
      <div className="w-1/2 bg-white flex items-center justify-center px-6">
        <form
          onSubmit={f_handleLogin}
          className="w-full max-w-sm space-y-5"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-2">
            <img src={logo} alt="Logo" className="h-45 mb-2" />
          </div>

          {cError && <p className="text-red-600 text-sm">{cError}</p>}

          {/* Usuario */}
          <div>
            <label className="text-sm font-semibold text-gray-800">USUARIO</label>
            <input
              type="email"
              value={cEmail}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md border-primary focus:outline-none shadow-sm"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm font-semibold text-gray-800">CONTRASEÑA</label>
            <input
              type="password"
              value={cPassword}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md border-primary focus:outline-none shadow-sm"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-2 bg-primary hover:bg-red-700 text-white font-bold rounded-md"
          >
            INICIAR SESIÓN
          </button>
        </form>
      </div>
    </div>
  );
}
