const express = require("express");
const router = express.Router();
const pool = require("../database").getConnection();  

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_prestamo,
        per.registro,
        per.nombre AS nombres,
        per.apellido AS apellidos,
        m.nombre_materia AS materia,
        p.fecha_prestamo AS fecha,
        GROUP_CONCAT(CONCAT(mat.nombre_material, ' (', dp.cantidad, ')') SEPARATOR ', ') AS materiales
      FROM prestamos p
      JOIN estudiante e ON p.id_persona = e.id_persona
      JOIN persona per ON e.id_persona = per.id_persona
      JOIN materia m ON p.id_materia = m.id_materia
      JOIN detalle_prestamo dp ON dp.id_prestamo = p.id_prestamo
      JOIN material mat ON dp.id_material = mat.id_material
      WHERE p.id_estado = 1
      GROUP BY p.id_prestamo, per.registro, per.nombre, per.apellido, m.nombre_materia, p.fecha_prestamo
      ORDER BY p.fecha_prestamo DESC, p.id_prestamo;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los préstamos:", error);
    res.status(500).json({ message: "Error al obtener los préstamos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      id_estudiante,
      id_docente,
      id_auxiliar_entrega,
      id_materia,
      id_estado //  el id_estado correspondiente a Prestado
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO Prestamo (id_estudiante, id_docente, id_auxiliar_entrega, id_materia, id_estado)
       VALUES (?, ?, ?, ?, ?)`,
      [id_estudiante, id_docente, id_auxiliar_entrega, id_materia, id_estado]
    );

    res.status(201).json({ mensaje: "Préstamo registrado", id_prestamo: result.insertId });
  } catch (error) {
    console.error("Error al registrar préstamo:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

module.exports = router;
