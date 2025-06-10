const express = require('express');
const router = express.Router();
const { getConnection } = require("../database");

router.get("/activos", async (req, res) => {
  try {
    const pool = getConnection();
  
    const [rows] = await pool.execute( //solo trae los No devueltos
       `SELECT p.*, e.descripcion AS estado_descripcion FROM Prestamo p
        JOIN Estado e ON p.id_estado = e.id_estado WHERE  e.descripcion != 'Devuelto' AND e.id_tipo_estado = 2`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener préstamos activos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});
module.exports = router;