import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrarDocente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    departamento: '',
    cedula: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the docente
    console.log('Submitting docente:', formData);
    navigate('/menu-admin'); // Redirect to admin menu after submission
  };

  return (
    <div className="container mt-5">
      <h2>Registrar Docente</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input 
            type="text" 
            className="form-control" 
            id="nombre" 
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido</label>
          <input 
            type="text" 
            className="form-control" 
            id="apellido" 
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input 
            type="email" 
            className="form-control" 
            id="correo" 
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="departamento" className="form-label">Departamento</label>
          <input 
            type="text" 
            className="form-control" 
            id="departamento" 
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cedula" className="form-label">Cédula</label>
          <input 
            type="text" 
            className="form-control" 
            id="cedula" 
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
}

export default RegistrarDocente;
