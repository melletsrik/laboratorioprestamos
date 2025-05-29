const express = require("express");
const router = express.Router();
const database = require("./database");
//poner 2 endpoints
router.post("/prestamo",async (req, res) => {
     const {id_estudiante, id_docente, id_usuario, id_materia, fecha_prestamo, estado, descripcion, detalles } = req.body;
     try {
        const connection = await database.getConnection();
        // Insertar en la tabla prestamo
        const result = await connection.query(
            "INSERT INTO prestamo (id_estudiante, id_docente, id_usuario, id_materia, fecha_prestamo, estado, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id_estudiante, id_docente, id_usuario, id_materia, fecha_prestamo, estado, descripcion]
        );
        const id_prestamo = result.insertId;
        // Insertar los detalles
        for (const detalle of detalles) {
            await connection.query(
                "INSERT INTO detalle_prestamo (id_prestamo, id_material, cantidad) VALUES (?, ?, ?)",
                [id_prestamo, detalle.id_material, detalle.cantidad]
            );
        }

        res.json({ exito: true, mensaje: "Préstamo registrado", id_prestamo });
    } catch (error) {
        console.error("Error al registrar préstamo:", error);
        res.status(500).json({ error: "Error al registrar el préstamo" });
    }
});
module.exports = router;