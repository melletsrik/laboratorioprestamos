const UsuarioService = require('../services/usuario.service');
const { ROLES } = require('../constants/permissions');

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

    const { nombre, apellido, nombre_usuario, password_, id_rol } = req.body;
    const usuarioData = {
      nombre,
      apellido,
      nombre_usuario,
      password_,
      id_rol,
      estado: true
    };

    const result = await UsuarioService.createUsuario(usuarioData, req);
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

exports.updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_rol } = req.body;
        
        if (!id_rol || isNaN(id_rol)) {
            return res.status(400).json({
                success: false,
                message: "El id_rol es requerido y debe ser un número"
            });
        }

        // Verificar que el usuario que hace la petición es administrador
        if (!req.user || !req.user.rol) {
            return res.status(401).json({
                success: false,
                message: "Usuario no autorizado"
            });
        }

        // Verificar que el usuario sea administrador
        if (req.user.id_rol !== 1) { // 1 es el ID del rol Administrativo
            return res.status(403).json({
                success: false,
                message: "Solo administradores pueden modificar roles"
            });
        }

        const result = await UsuarioService.updateRol(
            id, 
            id_rol, 
            req.user // Usar el usuario del token
        );

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Rol actualizado correctamente"
            });
        }

        return res.status(400).json({
            success: false,
            message: result.message || "Error al actualizar el rol"
        });
    } catch (error) {
        console.error("Error en updateRol:", error);
        
        // Propagar el mensaje de error específico del servicio
        if (error.message) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
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