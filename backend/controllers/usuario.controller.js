const UsuarioService = require("../services/usuario.service");

exports.createUsuario = async (req, res) => {
  try {
    const requiredFields = ['nombre', 'apellido', 'nombre_usuario', 'password_', 'id_rol'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(', ')}`,
        requiredFields
      });
    }

    const result = await UsuarioService.createUsuario(req.body, req.user);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Error en createUsuario:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

exports.updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        if (typeof estado !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "El estado debe ser true o false"
            });
        }

        const result = await UsuarioService.updateEstado(
            id, 
            estado, 
            req.user.id // Pasar el ID del usuario que hace la petición
        );

        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error("Error en updateEstado:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};