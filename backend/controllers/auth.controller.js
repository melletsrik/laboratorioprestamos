const AuthService = require('../services/auth.service');

exports.login = async (req, res) => {
  const { nombreUsuario, password_ } = req.body;
  
  if (!nombreUsuario || !password_) {
    return res.status(400).json({
      error: 'Nombre de usuario y contraseña son requeridos'
    });
  }

  const result = await AuthService.login(nombreUsuario, password_);
  
  if (!result.success) {
    return res.status(401).json({
      error: result.error
    });
  }

  res.json({
    token: result.token,
    usuario: result.usuario
  });
};