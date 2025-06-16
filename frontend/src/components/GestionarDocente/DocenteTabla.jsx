import React from "react";
import Docentes from "../../pages/Docentes";

const DocenteTabla = ({ docentes, onEditar }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
      <thead>
        <tr style={{ backgroundColor: "#D9D9D9", borderRadius: "10px" }}>
          <th style={{ padding: "10px" }}>Id</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Editar</th>
        </tr>
      </thead>
      <tbody>
        {docentes.map((docente, index) => {
          const isRed = index % 2 === 0;
          const bgColor = isRed ? "rgba(255, 0, 0, 0.1)" : "#D9D9D9";
          const rowStyle = {
            backgroundColor: bgColor,
            borderRadius: "10px",
            textAlign: "center",
            padding: "10px",
          };

          return (
            <tr key={docente.id} style={rowStyle}>
              <td>{docente.id}</td>
              <td>{docente.nombre}</td>
              <td>{docente.apellido}</td>
              <td>
                <button onClick={() => onEditar(docente.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "blue" }}>
                  Editar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DocenteTabla;
