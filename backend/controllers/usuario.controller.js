const UsuarioService = require("../services/usuario.service");

exports.createUsuario = async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.apellido ||
      !req.body.nombre_usuario ||
      !req.body.password_ || 
      !req.body.id_rol
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const result = await UsuarioService.createUsuario(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await UsuarioService.getAll();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

// Agregar este nuevo método
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (typeof estado !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Estado debe ser true o false"
      });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // No permitir desactivarse a sí mismo
    if (usuario.id_usuario === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No puedes desactivar tu propio usuario"
      });
    }

    await usuario.update({ estado });
    
    return res.status(200).json({
      success: true,
      message: "Estado de usuario actualizado"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};