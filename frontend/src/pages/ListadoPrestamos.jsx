import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListadoPrestamos() {
  const [aPrestamos, setAPrestamos] = useState([]);
  const [lLoading, setLLoading] = useState(true);
  const [cError, setCError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const f_fetchPrestamos = async () => {
      try {
        const response = await fetch("http://localhost:4000/prestamos", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Error al obtener los préstamos");
        const data = await response.json();
        setAPrestamos(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setCError(err.message);
        }
      } finally {
        setLLoading(false);
      }
    };

    f_fetchPrestamos();

    return () => controller.abort();
  }, []);

  const f_irADevolver = (p_idPrestamo) => {
    navigate(`/devoluciones/${p_idPrestamo}`);
  };

  const f_formatDate = (p_dateStr) => {
    if (!p_dateStr) return "N/A";
    const date = new Date(p_dateStr);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString("es-PE");
  };

  if (lLoading) {
    return <p className="p-6 text-gray-600 italic">Cargando préstamos...</p>;
  }

  if (cError) {
    return (
      <p className="p-6 text-red-600 font-semibold">
        Ocurrió un error: {cError}
      </p>
    );
  }

  return (
    <div className="p-6">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Préstamos activos
      </h2>

      <div
        className="overflow-x-auto rounded-md shadow-md"
        style={{
          borderColor: "var(--color-primary)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead
            style={{
              backgroundColor: "var(--color-primary-light)",
              color: "black",
            }}
          >
            <tr>
              <th className="px-4 py-2">CÓDIGO</th>
              <th className="px-4 py-2">REGISTRO</th>
              <th className="px-4 py-2">NOMBRE</th>
              <th className="px-4 py-2">FECHA PRÉSTAMO</th>
              <th className="px-4 py-2">MATERIA</th>
              <th className="px-4 py-2">MÓDULO</th>
              <th className="px-4 py-2 text-center">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {aPrestamos.map((p, i) => {
              const cNombreCompleto = `${p.nombres ?? "N/A"}${p.apellidos ? " " + p.apellidos : ""}`;
              return (
                <tr
                  key={p.id_prestamo}
                  style={{
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(0,128,0,0.1)",
                    transition: "background-color 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(0,128,0,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "transparent" : "rgba(0,128,0,0.1)")
                  }
                >
                  <td className="px-4 py-2">{p.id_prestamo ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.registro ?? "N/A"}</td>
                  <td className="px-4 py-2">{cNombreCompleto}</td>
                  <td className="px-4 py-2">{f_formatDate(p.fecha)}</td>
                  <td className="px-4 py-2">{p.materia ?? "N/A"}</td>
                  <td className="px-4 py-2">{p.modulo ?? "N/A"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => f_irADevolver(p.id_prestamo)}
                      type="button"
                      style={{ backgroundColor: "var(--color-primary)" }}
                      className="text-white px-4 py-1 rounded hover:brightness-90 transition"
                    >
                      Registrar devolución
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
