const PersonaService = require('../services/persona.service');

exports.crearPersona = async (req, res) => {
  const result = await PersonaService.crearPersona(req.body);
  
  const status = result.success ? 201 : 400;
  res.status(status).json(result);
};