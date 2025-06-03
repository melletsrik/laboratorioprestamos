  import { useState } from "react";
  import axios from "axios";
  import logo from "../assets/logo.png";
  import Button from "../components/Button";

  export default function RegistrarEstudiante() {
    const [p_nRegistro, setRegistro] = useState("");
    const [p_cNombre, setNombre] = useState("");
    const [p_cApellido, setApellido] = useState("");
    const [cMensaje, setMensaje] = useState("");

    const f_registrar = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post("http://localhost:4000/estudiantes/registrar-estudiante", {
          p_nRegistro,
          p_cNombre,
          p_cApellido,
        });
        setMensaje(res.data.mensaje);
        setRegistro("");
        setNombre("");
        setApellido("");
      } catch (err) {
        console.error(err);
        setMensaje("Error al registrar estudiante");
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="h-20 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Registro de Persona
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
