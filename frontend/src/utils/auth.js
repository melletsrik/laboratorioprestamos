export const Auth = {
  // Cache para el token
  tokenCache: null,
  rolCache: null,
  
  // Rutas públicas que no requieren autenticación
  publicPaths: ['/login', '/unauthorized'],
  
  // Initialize the auth system
  init() {
    this.tokenCache = localStorage.getItem('token');
    this.rolCache = localStorage.getItem('rol');
    this.setupEventListeners();
    
    // Prevent initial back button issue
    window.history.pushState(null, null, window.location.href);
  },
  
  setupEventListeners() {
    // Remove any existing listeners to prevent duplicates
    window.removeEventListener('popstate', this.handlePopState);
    
    // Bind the context and add new listener
    this.handlePopState = this.handlePopState.bind(this);
    window.addEventListener('popstate', this.handlePopState);
  },
  
  handlePopState(event) {
    const currentPath = window.location.pathname;
    
    // Si el usuario no está autenticado y está intentando acceder a rutas protegidas
    if (!this.isAuthenticated() && !this.isPublicPath(currentPath)) {
      // Prevenir el comportamiento por defecto de navegación hacia atrás
      event.preventDefault();
      // Redirigir al login
      window.history.pushState(null, '', '/login');
      window.dispatchEvent(new Event('popstate'));
    }
  },
  
  isPublicPath(path) {
    return this.publicPaths.some(publicPath => 
      path === publicPath || path.startsWith(publicPath + '/')
    );
  },

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
    localStorage.setItem('lastActivity', new Date().getTime());
    this.tokenCache = token;
    this.rolCache = rol;
  },

  clearToken() {
    // Clear all auth related data
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    this.tokenCache = null;
    this.rolCache = null;
    
    // Clear browser history and prevent going back
    window.history.pushState(null, '', '/login');
    window.dispatchEvent(new Event('popstate'));
  },

  isAuthenticated() {
    // Check if token exists
    const token = this.getToken();
    return !!token;
  },

  isRol(rol) {
    return this.getRol() === rol;
  },
  
  // Initialize the auth system
  initAuth() {
    this.init();
    
    // If not on login page and not authenticated, redirect to login
    if (!this.isAuthenticated() && window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
      return;
    }
    
    // If authenticated and on login page, redirect to appropriate dashboard
    if (this.isAuthenticated() && window.location.pathname === '/login') {
      const role = this.getRol();
      window.history.replaceState(null, '', role === 'Administrativo' ? '/menu-admin' : '/menu-aux');
    }
  }
};