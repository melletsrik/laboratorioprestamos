const UsuarioService = require("../services/usuario.service");

exports.createAuxiliar = async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.apellido ||
      !req.body.nombre_usuario ||
      !req.body.password_
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    const result = await UsuarioService.createAuxiliar(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

exports.getAllAuxiliares = async (req, res) => {
  try {
    const result = await UsuarioService.getAllAuxiliares();
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
