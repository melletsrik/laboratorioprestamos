// Utility functions for date formatting

export const formatearFechaBD = (fecha = new Date()) => {
  const fechaLocal = new Date(fecha);
  const pad = (num) => num.toString().padStart(2, '0');
  const year = fechaLocal.getFullYear();
  const month = pad(fechaLocal.getMonth() + 1);
  const day = pad(fechaLocal.getDate());
  const hours = pad(fechaLocal.getHours());
  const minutes = pad(fechaLocal.getMinutes());
  const seconds = pad(fechaLocal.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatearFechaUI = (fecha = new Date()) => {
  const fechaLocal = new Date(fecha);
  const pad = (num) => num.toString().padStart(2, '0');
  const year = fechaLocal.getFullYear();
  const month = pad(fechaLocal.getMonth() + 1);
  const day = pad(fechaLocal.getDate());
  const hours = pad(fechaLocal.getHours());
  const minutes = pad(fechaLocal.getMinutes());
  const seconds = pad(fechaLocal.getSeconds());
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
