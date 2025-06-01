-- Crear la base de datos y usarla
CREATE DATABASE IF NOT EXISTS `sistema_prestamos_electronica`;
USE `sistema_prestamos_electronica`;

-- Tabla: persona
DROP TABLE IF EXISTS `persona`;
CREATE TABLE `persona` (
  `id_Persona` INT NOT NULL AUTO_INCREMENT,
  `registro` INT DEFAULT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id_Persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: docente
DROP TABLE IF EXISTS `docente`;
CREATE TABLE `docente` (
  `id_docente` INT NOT NULL AUTO_INCREMENT,
  `id_persona` INT NOT NULL,
  PRIMARY KEY (`id_docente`),
  CONSTRAINT `fk_docente_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_Persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: estudiante
DROP TABLE IF EXISTS `estudiante`;
CREATE TABLE `estudiante` (
  `id_estudiante` INT NOT NULL AUTO_INCREMENT,
  `id_persona` INT NOT NULL,
  PRIMARY KEY (`id_estudiante`),
  CONSTRAINT `fk_estudiante_persona` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_Persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: materia
DROP TABLE IF EXISTS `materia`;
CREATE TABLE `materia` (
  `id_materia` INT NOT NULL AUTO_INCREMENT,
  `nombre_materia` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: estado
DROP TABLE IF EXISTS `estado`;
CREATE TABLE `estado` (
  `id_estado` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: rol
DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `id_rol` INT NOT NULL,
  `descripcion` VARCHAR(25) DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: usuario
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(50) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `id_rol` INT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: material
DROP TABLE IF EXISTS `material`;
CREATE TABLE `material` (
  `id_material` INT NOT NULL AUTO_INCREMENT,
  `nombre_material` VARCHAR(100) DEFAULT NULL,
  `cantidad_total` INT NOT NULL,
  `codigo_material` INT NOT NULL,
  PRIMARY KEY (`id_material`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: prestamo
DROP TABLE IF EXISTS `prestamo`;
CREATE TABLE `prestamo` (
  `id_prestamo` INT NOT NULL AUTO_INCREMENT,
  `id_estudiante` INT NOT NULL,
  `id_docente` INT NOT NULL,
  `id_usuario` INT NOT NULL,
  `id_materia` INT NOT NULL,
  `fecha_prestamo` DATE DEFAULT NULL,
  `fecha_devolucion` DATE DEFAULT NULL,
  `estado` INT NOT NULL,
  `descripcion` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id_prestamo`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`),
  FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`),
  FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`),
  FOREIGN KEY (`estado`) REFERENCES `estado` (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: detalle_prestamo
DROP TABLE IF EXISTS `detalle_prestamo`;
CREATE TABLE `detalle_prestamo` (
  `id_detalle_prestamo` INT NOT NULL AUTO_INCREMENT,
  `id_prestamo` INT NOT NULL,
  `id_material` INT NOT NULL,
  `cantidad` INT NOT NULL,
  PRIMARY KEY (`id_detalle_prestamo`),
  FOREIGN KEY (`id_prestamo`) REFERENCES `prestamo` (`id_prestamo`),
  FOREIGN KEY (`id_material`) REFERENCES `material` (`id_material`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar datos en persona
INSERT INTO `persona` VALUES
(1,11,'Jaime','Huallpara'),
(2,22,'Celeste','a'),
(3,733295,'nag','aj'),
(4,444,'jose','rojas');

-- Insertar datos en docente
INSERT INTO `docente` VALUES (1,4);

-- Insertar datos en estudiante
INSERT INTO `estudiante` VALUES (1,3);

-- Insertar datos en materia
INSERT INTO `materia` VALUES (1,'base de datos');

-- Insertar datos en estado
INSERT INTO `estado` VALUES (1,'prestado'),(2,'en almacen');

-- Insertar datos en rol
INSERT INTO `rol` VALUES (1,'encargado'),(2,'auxiliar');

-- Insertar datos en usuario
INSERT INTO `usuario` VALUES (1,'admin','123',1),(2,'aux','456',2);

-- Insertar datos en material
INSERT INTO `material` VALUES (1,'arduino',20,11);

-- Insertar datos en prestamo
INSERT INTO `prestamo` VALUES
(1,1,1,2,1,'2025-05-28',NULL,1,'se le presto...'),
(2,1,1,2,1,'2024-06-01',NULL,1,'se'),
(3,1,1,2,1,'2024-06-01',NULL,1,'Préstamo de materiales'),
(4,1,1,2,1,'2024-06-01',NULL,1,'Préstamo de materiales'),
(5,1,1,2,1,'2024-06-01',NULL,1,'Préstamo de materiales'),
(6,1,1,2,1,'2025-06-22',NULL,1,'Préstamo de materiales'),
(7,1,1,2,1,'2025-06-22',NULL,1,'Préstamo de materiales');

-- Insertar datos en detalle_prestamo
INSERT INTO `detalle_prestamo` VALUES
(1,1,1,5),(2,4,1,2),(4,5,1,2),
(5,5,1,1),(6,6,1,1),(7,6,1,1),
(8,7,1,1),(9,7,1,1);