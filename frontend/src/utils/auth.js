export const Auth = {
  // Obtener el token
  getToken() {
    return localStorage.getItem('token');
  },

  // Guardar el token (cuando se inicia sesión)
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // Eliminar el token (cuando se cierra sesión)
  clearToken() {
    localStorage.removeItem('token');
  },

  // Verificar si hay sesión activa
  isAuthenticated() {
    return !!this.getToken();
  }
};