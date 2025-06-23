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
