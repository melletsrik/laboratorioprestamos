const { Persona } = require('../models');

class PersonaService {
  static async crearPersona(personaData) {
    try {
      const persona = await Persona.create(personaData);
      return {
        success: true,
        data: persona
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = PersonaService;