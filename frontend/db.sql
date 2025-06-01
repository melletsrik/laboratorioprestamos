-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS sistema_prestamos_electronica;
USE sistema_prestamos_electronica;

-- Tabla: rol (tipo de persona)
DROP TABLE IF EXISTS rol;
CREATE TABLE rol (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL UNIQUE -- Ej: 'Estudiante', 'Docente', 'Auxiliar', 'Administrativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: persona
DROP TABLE IF EXISTS persona;
CREATE TABLE persona (
  id_persona INT AUTO_INCREMENT PRIMARY KEY,
  registro INT DEFAULT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50),
  id_rol INT NOT NULL,
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: rol_usuario (roles para sistema: permisos y acceso)
DROP TABLE IF EXISTS rol_usuario;
CREATE TABLE rol_usuario (
  id_rol_usuario INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(25) NOT NULL UNIQUE -- Ej: 'Auxiliar', 'Administrativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: usuario
DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_persona INT NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  id_rol_usuario INT NOT NULL,
  FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
  FOREIGN KEY (id_rol_usuario) REFERENCES rol_usuario(id_rol_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: materia
DROP TABLE IF EXISTS materia;
CREATE TABLE materia (
  id_materia INT AUTO_INCREMENT PRIMARY KEY,
  nombre_materia VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: estado
DROP TABLE IF EXISTS estado;
CREATE TABLE estado (
  id_estado INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(50) NOT NULL UNIQUE -- Ej: 'Prestado', 'En almacen', 'Devuelto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: material
DROP TABLE IF EXISTS material;
CREATE TABLE material (
  id_material INT AUTO_INCREMENT PRIMARY KEY,
  nombre_material VARCHAR(100) NOT NULL,
  cantidad_total INT NOT NULL,
  codigo_material VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: prestamo
DROP TABLE IF EXISTS prestamo;
CREATE TABLE prestamo (
  id_prestamo INT AUTO_INCREMENT PRIMARY KEY,
  id_persona INT NOT NULL, -- Persona que recibe el préstamo (estudiante o docente)
  id_usuario_registra INT NOT NULL, -- Usuario que registra el préstamo (auxiliar/admin)
  id_materia INT NOT NULL,
  fecha_prestamo DATE NOT NULL,
  fecha_devolucion DATE DEFAULT NULL,
  id_estado INT NOT NULL,
  descripcion VARCHAR(255),
  FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
  FOREIGN KEY (id_usuario_registra) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_materia) REFERENCES materia(id_materia),
  FOREIGN KEY (id_estado) REFERENCES estado(id_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: detalle_prestamo
DROP TABLE IF EXISTS detalle_prestamo;
CREATE TABLE detalle_prestamo (
  id_detalle_prestamo INT AUTO_INCREMENT PRIMARY KEY,
  id_prestamo INT NOT NULL,
  id_material INT NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (id_prestamo) REFERENCES prestamo(id_prestamo),
  FOREIGN KEY (id_material) REFERENCES material(id_material)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar roles (tipo persona)
INSERT INTO rol (descripcion) VALUES
('Estudiante'),
('Docente'),
('Auxiliar'),
('Administrativo');

-- Insertar roles de usuario (permisos)
INSERT INTO rol_usuario (descripcion) VALUES
('Auxiliar'),
('Administrativo');

-- Insertar estados
INSERT INTO estado (descripcion) VALUES
('Prestado'),
('En almacen'),
('Devuelto');

-- Insertar materias
INSERT INTO materia (nombre_materia) VALUES
('Base de datos'),
('Electrónica'),
('Programación');

-- Insertar personas ejemplo
INSERT INTO persona (registro, nombre, apellido, id_rol) VALUES
(12345, 'Jaime', 'Huallpara', 3),      -- Auxiliar
(67890, 'Celeste', 'Perez', 4),       -- Administrativo
(11111, 'Nag', 'Aj', 1),               -- Estudiante
(22222, 'Jose', 'Rojas', 2);           -- Docente

-- Insertar usuarios para personas con acceso al sistema
INSERT INTO usuario (id_persona, nombre_usuario, contrasena, id_rol_usuario) VALUES
(1, 'auxiliar1', 'hashed_password_1', 1),
(2, 'admin1', 'hashed_password_2', 2);

-- Insertar materiales
INSERT INTO material (nombre_material, cantidad_total, codigo_material) VALUES
('Arduino', 20, 'MAT-001'),
('Resistor', 100, 'MAT-002'),
('Protoboard', 50, 'MAT-003');

-- Ejemplo de préstamo
INSERT INTO prestamo (id_persona, id_usuario_registra, id_materia, fecha_prestamo, fecha_devolucion, id_estado, descripcion) VALUES
(3, 1, 1, '2025-05-28', NULL, 1, 'Préstamo para proyecto de base de datos');

-- Ejemplo de detalle de préstamo (materiales prestados)
INSERT INTO detalle_prestamo (id_prestamo, id_material, cantidad) VALUES
(1, 1, 5),
(1, 2, 10);
