export const Auth = {
  // Cache para el token
  tokenCache: null,
  rolCache: null,

  getToken() {
    if (this.tokenCache === null) {
      this.tokenCache = localStorage.getItem('token');
    }
    return this.tokenCache;
  },

  getRol() {
    if (this.rolCache === null) {
      this.rolCache = localStorage.getItem('rol');
    }
    return this.rolCache;
  },

  setToken(token, rol) {
    localStorage.setItem('token', token);
    localStorage.setItem('rol', rol);
    this.tokenCache = token;
    this.rolCache = rol;
  },

  clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.tokenCache = null;
    this.rolCache = null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isRol(rol) {
    return this.getRol() === rol;
  }
};