import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import Button from "../components/Button"; // Asegúrate que Button tenga diseño acorde

export default function RegistrarUsuario() {
  const [p_nRegistro, setRegistro] = useState("");
  const [p_cNombre, setNombre] = useState("");
  const [p_cApellido, setApellido] = useState("");
  const [p_cNombreUsuario, setNombreUsuario] = useState("");
  const [p_cPassword, setPassword] = useState("");
  const [p_nRol, setRol] = useState(2);
  const [cMensaje, setMensaje] = useState("");

  const f_registrar = async (e) => {
    e.preventDefault();
    if (![1, 2].includes(Number(p_nRol))) {
      setMensaje("El rol debe ser Administrador o Auxiliar.");
      return;
    }

    try {
      const personaRes = await axios.post(
        "http://localhost:4000/personas/registrar-persona",
        {
          registro: p_nRegistro,
          nombre: p_cNombre,
          apellido: p_cApellido,
        }
      );

      const idPersona = personaRes.data.id_persona;

      await axios.post("http://localhost:4000/usuarios/registrar-usuario", {
        id_persona: idPersona,
        nombre_usuario: p_cNombreUsuario,
        password: p_cPassword,
        rol: Number(p_nRol),
      });

      setMensaje("Usuario registrado correctamente.");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-20 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Registro de Usuario
          </h2>
        </div>

        {cMensaje && (
          <div
            className={`text-sm text-center mb-4 font-medium ${
              cMensaje.includes("correctamente")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {cMensaje}
          </div>
        )}

        <form onSubmit={f_registrar} className="space-y-4">
          {[
            {
              label: "Registro",
              type: "number",
              value: p_nRegistro,
              onChange: setRegistro,
            },
            {
              label: "Nombre",
              type: "text",
              value: p_cNombre,
              onChange: setNombre,
            },
            {
              label: "Apellido",
              type: "text",
              value: p_cApellido,
              onChange: setApellido,
            },
            {
              label: "Nombre de Usuario",
              type: "text",
              value: p_cNombreUsuario,
              onChange: setNombreUsuario,
            },
            {
              label: "Contraseña",
              type: "password",
              value: p_cPassword,
              onChange: setPassword,
            },
          ].map(({ label, type, value, onChange }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              value={p_nRol}
              onChange={(e) => setRol(Number(e.target.value))}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={1}>Administrador</option>
              <option value={2}>Auxiliar</option>
            </select>
          </div>
          <div className="text-center">
            <Button type="submit" variant="red">
              REGISTRAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
