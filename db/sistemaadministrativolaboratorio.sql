DROP DATABASE IF EXISTS sistemaadministrativolaboratorio;
CREATE DATABASE sistemaadministrativolaboratorio;
USE sistemaadministrativolaboratorio;


DROP TABLE IF EXISTS Detalle_Prestamo;
DROP TABLE IF EXISTS Prestamo;
DROP TABLE IF EXISTS Estado_Prestamo;
DROP TABLE IF EXISTS Material;
DROP TABLE IF EXISTS Estudiante_Materia;
DROP TABLE IF EXISTS Docente_Materia;
DROP TABLE IF EXISTS Materia;
DROP TABLE IF EXISTS Materia_Carrera;
DROP TABLE IF EXISTS Carrera;
DROP TABLE IF EXISTS Facultad;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Rol;
DROP TABLE IF EXISTS Docente;
DROP TABLE IF EXISTS Estudiante;
DROP TABLE IF EXISTS Persona;


-- ====================
-- PERSONAS
-- ====================

CREATE TABLE Persona (
    id_persona INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(25) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    PRIMARY KEY(id_persona)
);

CREATE TABLE Estudiante (
    id_estudiante INT AUTO_INCREMENT,
    id_persona INT NOT NULL,
    Registro VARCHAR(25) NOT NULL UNIQUE,
    PRIMARY KEY(id_estudiante),
    FOREIGN KEY(id_persona) REFERENCES Persona(id_persona)
);

CREATE TABLE Docente (
    id_docente INT AUTO_INCREMENT,
    id_persona INT NOT NULL,
    estado BOOLEAN,
    PRIMARY KEY(id_docente),
    FOREIGN KEY(id_persona) REFERENCES Persona(id_persona)
);

-- ====================
-- ROLES Y USUARIOS
-- ====================

CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT,
    descripcion VARCHAR(25) NOT NULL,
    PRIMARY KEY(id_rol)
);

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT,
    nombre VARCHAR(25) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    password_ VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    estado BOOLEAN,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- ====================
-- ESTRUCTURA ACADÉMICA
-- ====================

CREATE TABLE Facultad (
    id_facultad INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY(id_facultad)
);

CREATE TABLE Carrera (
    id_carrera INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_facultad INT NOT NULL,
    PRIMARY KEY(id_carrera),
    FOREIGN KEY(id_facultad) REFERENCES Facultad(id_facultad)
);

CREATE TABLE Materia (
    id_materia INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_carrera INT NOT NULL,
    PRIMARY KEY(id_materia),
    FOREIGN KEY(id_carrera) REFERENCES Carrera(id_carrera)
);

CREATE TABLE Materia_Carrera (
    id_materia_carrera INT AUTO_INCREMENT,
    id_materia INT NOT NULL,
    id_carrera INT NOT NULL,
    PRIMARY KEY(id_materia_carrera),
    FOREIGN KEY(id_materia) REFERENCES Materia(id_materia),
    FOREIGN KEY(id_carrera) REFERENCES Carrera(id_carrera)
);


CREATE TABLE Docente_Materia (
    id_docente_materia INT AUTO_INCREMENT,
    id_materia INT NOT NULL,
    id_docente INT NOT NULL,
    PRIMARY KEY(id_docente_materia),
    FOREIGN KEY(id_materia) REFERENCES Materia(id_materia),
    FOREIGN KEY(id_docente) REFERENCES Docente(id_docente)
);

-- ====================
-- INVENTARIO DE MATERIALES
-- ====================

CREATE TABLE Material (
    id_material INT AUTO_INCREMENT,
    codigo_material VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    cantidad_total INT NOT NULL,
    especificaciones TEXT,
    PRIMARY KEY(id_material)
);

-- ====================
-- ESTADOS DE PRÉSTAMO
-- ====================

CREATE TABLE Estado_Prestamo (
    id_estado INT AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    PRIMARY KEY(id_estado)
);

-- ====================
-- PRÉSTAMOS
-- ====================

CREATE TABLE Prestamo (
    id_prestamo INT AUTO_INCREMENT,
    id_estudiante INT NOT NULL,
    id_docente INT,
    id_materia INT,
    id_usuario_entrega INT NOT NULL,
    id_usuario_recibe INT,
    fecha_prestamo DATETIME NOT NULL,
    fecha_devolucion DATETIME,
    id_modulo INT NOT NULL,
    id_semestre INT NOT NULL,
    id_estado INT NOT NULL,
    observaciones TEXT,
    PRIMARY KEY(id_prestamo),
    FOREIGN KEY(id_estudiante) REFERENCES Estudiante(id_estudiante),
    FOREIGN KEY(id_docente) REFERENCES Docente(id_docente),
    FOREIGN KEY(id_materia) REFERENCES Materia(id_materia),
    FOREIGN KEY(id_usuario_entrega) REFERENCES Usuario(id_usuario),
    FOREIGN KEY(id_usuario_recibe) REFERENCES Usuario(id_usuario),
    FOREIGN KEY(id_estado) REFERENCES Estado_Prestamo(id_estado)
);

-- ====================
-- DETALLE DE PRÉSTAMOS
-- ====================

CREATE TABLE Detalle_Prestamo (
    id_detalle_prestamo INT AUTO_INCREMENT,
    id_prestamo INT NOT NULL,
    id_material INT NOT NULL,
    cantidad INT NOT NULL,
    cantidad_devuelta INT DEFAULT 0,
    PRIMARY KEY(id_detalle_prestamo),
    FOREIGN KEY(id_prestamo) REFERENCES Prestamo(id_prestamo),
    FOREIGN KEY(id_material) REFERENCES Material(id_material)
);

-- ====================
-- DATOS INICIALES
-- ====================

INSERT INTO Estado_Prestamo(nombre) VALUES ('Activo'), ('Parcial'), ('Devuelto');
INSERT INTO Rol(descripcion) VALUES ('Administrativo'), ('Auxiliar');


INSERT INTO Facultad (nombre) VALUES
('Ciencias Empresariales'),
('Ciencias y Tecnología'),
('Ciencias Jurídicas, Sociales y Humanísticas');

INSERT INTO Carrera (nombre, id_facultad) VALUES
('Administración General', 1),
('Administración de Turismo', 1),
('Ingeniería Comercial', 1),
('Comercio Internacional', 1),
('Ingeniería en Marketing y Publicidad', 1),
('Contaduría Pública', 1),
('Ingeniería Financiera', 1),
('Comunicación Estratégica y Digital', 1),

('Ingeniería Industrial y Comercial', 2),
('Ingeniería en Administración Petrolera', 2),
('Ingeniería Electrónica y Sistemas', 2),
('Ingeniería Mecánica Automotriz y Agroindustrial', 2),
('Ingeniería de Sistemas', 2),
('Ingeniería en Redes y Telecomunicaciones', 2),
('Ingeniería Eléctrica', 2),

('Derecho', 3),
('Relaciones Internacionales', 3),
('Psicología', 3);

INSERT INTO Persona (nombre, apellido) VALUES ('Luis Pablo', 'Antelo Baldelomar');
INSERT INTO Persona (nombre, apellido) VALUES ('Gabriel Alejandro', 'Cabezas Gutiérrez');
INSERT INTO Persona (nombre, apellido) VALUES ('Luis Jaime', 'Huallpara Guerrero');
INSERT INTO Persona (nombre, apellido) VALUES ('Gregori José', 'Mireles Monagas');
INSERT INTO Persona (nombre, apellido) VALUES ('Juan Miguel', 'Tintaya');
INSERT INTO Persona (nombre, apellido) VALUES ('Gustavo', 'Melgar');
INSERT INTO Persona (nombre, apellido) VALUES ('Jose Orlando', 'Moscoso');
INSERT INTO Persona (nombre, apellido) VALUES ('Milton Freddy', 'Montaño');
INSERT INTO Persona (nombre, apellido) VALUES ('Emilio Lazaro', 'Martínez');
INSERT INTO Persona (nombre, apellido) VALUES ('Hugo Javier', 'Ponce');
INSERT INTO Persona (nombre, apellido) VALUES ('María', 'García');
INSERT INTO Persona (nombre, apellido) VALUES('Juan', 'Pérez'); 

INSERT INTO Docente (id_docente, id_persona) VALUES (1, 1);
INSERT INTO Docente (id_docente, id_persona) VALUES (2, 2);
INSERT INTO Docente (id_docente, id_persona) VALUES (3, 3);
INSERT INTO Docente (id_docente, id_persona) VALUES (4, 4);
INSERT INTO Docente (id_docente, id_persona) VALUES (5, 5);
INSERT INTO Docente (id_docente, id_persona) VALUES (6, 6);
INSERT INTO Docente (id_docente, id_persona) VALUES (7, 7);
INSERT INTO Docente (id_docente, id_persona) VALUES (8, 8);
INSERT INTO Docente (id_docente, id_persona) VALUES (9, 9);
INSERT INTO Docente (id_docente, id_persona) VALUES (10, 10);

INSERT INTO Estudiante (id_estudiante, id_persona, Registro) VALUES (1, 11, '681350');
INSERT INTO Estudiante (id_estudiante, id_persona, Registro) VALUES (2, 12, '606060');

INSERT INTO Usuario (nombre, apellido, nombre_usuario, password_, id_rol, estado)
VALUES ('Melissa', 'Chambi', 'mel', '$2a$12$dhcnijP523/INAP6FX0XaepN5II8txoQ71LuB6TWX5KzP4FCv03i2', 1, true);
INSERT INTO Usuario (nombre, apellido, nombre_usuario, password_, id_rol, estado)
VALUES ('Melissa', 'Chambi', 'meli', '$2a$12$dhcnijP523/INAP6FX0XaepN5II8txoQ71LuB6TWX5KzP4FCv03i2', 2, true);
INSERT INTO usuario (nombre, apellido, nombre_usuario, password_, id_rol) 
VALUES ('Nagely', 'A', 'n', '$2b$10$iiJT5FjvRHWH85ruJlBpjuA4FmBKEPcBNSVSgXbB/yymufpFKbQnm', 1, true);


INSERT INTO Material (codigo_material, nombre, cantidad_total, especificaciones) 
VALUES 
('11111', 'Protoboard', 25, 'Protoboard estándar de 830 puntos, ideal para prototipos.'),
('22223', 'Fuente de poder', 6, 'Fuente regulable de 0-30V / 0-5A con pantalla digital.'),
('MAT005', 'Arduino UNO', 15, 'Placa Arduino UNO R3 original con cable USB.'),
('MAT007', 'Transistor BC547', 100, 'Transistor NPN de propósito general, TO-92.'),
('MAT008', 'Capacitor electrolítico 100µF', 200, 'Capacitor de 100 microfaradios, 25V.'),
('MAT009', 'LED rojo 5mm', 500, 'LED rojo de 5mm, 2V, 20mA.'),
('MAT010', 'Resistencia 1kΩ', 1000, 'Resistencia de 1 kilo-ohm, 1/4W, ±5%.');


INSERT INTO Materia (nombre, id_carrera) VALUES
('Electricidad y Automatismos', 11),
('Robótica', 11),
('Intro. Electrónica', 11),
('Sistemas de control distribuido', 11),
('Equipamiento Biomédico', 11),
('Circuitos Eléctricos', 11),
('Electrónica Analógica I', 11),
('Electrónica Analógica II', 11),
('Electrónica Digital', 11),
('Electrónica de Potencia', 11),
('Examen de Grado', 11),
('Instrumentación y Comunicaciones Ind.', 11),
('Instalaciones Eléctricas', 11),
('Microcontroladores', 11),
('Sistemas Digitales Programables', 11),
('Taller de Automatización', 11);