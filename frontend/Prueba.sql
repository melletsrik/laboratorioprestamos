Drop database if exists Prueba;
create database Prueba;
use Prueba;
drop table if exists Detalle_Prestamo;
drop table if exists Prestamo;
drop table if exists Estado;
drop table if exists Materia;
drop table if exists Material;
drop table if exists Usuario;
drop table if exists Rol;
drop table if exists Estudiante;
drop table if exists Persona;


Create table Persona(
    id_persona int not null auto_increment,
    registro int,
    nombre varchar (25),
    apellido varchar(50),
    primary key(id_persona)
);

Create table Docente(
    id_docente int not null auto_increment,
    id_persona int not null,
    primary key (id_docente),
    FOREIGN key (id_persona) REFERENCES Persona(id_persona)
);

Create table Materia(
    id_materia int not null auto_increment,
    nombre_materia varchar(50),
    id_docente int not null,
    primary key(id_materia),
    FOREIGN key(id_docente) REFERENCES Docente(id_docente)
);

Create table Estudiante(
    id_estudiante int not null auto_increment,
    id_persona int not null,
    primary key(id_estudiante),
    FOREIGN key(id_persona) REFERENCES Persona(id_persona)
);

Create table Rol(
    id_rol int not null, 
    descripcion varchar(25),
    primary key(id_rol)
);

Create table Usuario(
    id_usuario int auto_increment,
    id_persona int not null,
    nombre_usuario varchar(25),
    password_ varchar(255),
    rol int not null,
    primary key (id_usuario),
    FOREIGN key (id_persona) REFERENCES Persona(id_persona),
    FOREIGN key (rol) REFERENCES Rol(id_rol)
);

Create table Material(
    id_material int not null auto_increment,
    codigo_material int not null,
    nombre_material VARCHAR(100), 
    cantidad int not null,
    primary key (id_material)
);

create table Estado(
    id_estado int not null auto_increment,
    descripcion varchar(50),
    primary key(id_estado)
);

Create table Prestamo(
    id_prestamo int not null auto_increment,
    id_estudiante int not null,
    id_docente int not null,
    id_auxiliar int not null,
    id_materia int not null,
    fecha_prestamo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion datetime,
    estado int NOT NULL,
    descripcion VARCHAR(100) NUll,
    PRIMARY KEY (id_prestamo),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiante(id_estudiante),
    FOREIGN key (id_docente) REFERENCES Docente(id_docente),
    FOREIGN key (id_auxiliar) REFERENCES Usuario(id_usuario),
    FOREIGN key (id_materia) REFERENCES Materia(id_materia),
    FOREIGN key (estado) REFERENCES Estado(id_estado)
);


Create table Detalle_Prestamo(
    id_detalle_prestamo int not null,
    id_prestamo int not null,
    id_material int not null,
    cantidad int not null ,
    primary key (id_detalle_prestamo),
    FOREIGN key (id_prestamo) REFERENCES Prestamo(id_prestamo),
    FOREIGN key (id_material) REFERENCES Material(id_material)
);

