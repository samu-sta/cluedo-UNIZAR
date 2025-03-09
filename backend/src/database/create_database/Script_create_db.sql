CREATE DATABASE CluedoDB;
USE CluedoDB;

CREATE TABLE EstadoPartida (
    id_estado ENUM('NO_EMPEZADA', 'EN_JUEGO', 'FINALIZADA') PRIMARY KEY
);

CREATE TABLE Cuenta (
    id_cuenta INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_cuenta INT UNIQUE,
	FOREIGN KEY (id_cuenta) REFERENCES Cuenta(id_cuenta) ON DELETE CASCADE

);

CREATE TABLE Administrador (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    id_cuenta INT UNIQUE,
    id_usuario INT UNIQUE,
    FOREIGN KEY (id_cuenta) REFERENCES Cuenta(id_cuenta) ON DELETE CASCADE
);

CREATE TABLE Tablero (
    id_tablero INT PRIMARY KEY AUTO_INCREMENT,
    filas INT NOT NULL,
    columnas INT NOT NULL
);

CREATE TABLE Habitacion (
    id_habitacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_tablero INT,
    FOREIGN KEY (id_tablero) REFERENCES Tablero(id_tablero) ON DELETE CASCADE
);

create table puerta (
	id_puerta int primary key,
    fila int,
    columna int,
    id_habitacion int,
    foreign key (id_habitacion) references Habitacion(id_habitacion) on delete cascade
);

CREATE TABLE Carta (
    id_carta INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('arma', 'personaje', 'habitacion') NOT NULL, -- Se define el tipo de carta
    id_habitacion INT NULL, -- Solo se usará si es una carta de tipo 'habitacion'
    FOREIGN KEY (id_habitacion) REFERENCES Habitacion(id_habitacion) ON DELETE SET NULL
);

CREATE TABLE Partida (
    id_partida INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    estado ENUM('NO_EMPEZADA', 'EN_JUEGO', 'FINALIZADA') DEFAULT 'NO_EMPEZADA',
    turno INT DEFAULT 0,
    id_tablero INT,
    FOREIGN KEY (id_tablero) REFERENCES Tablero(id_tablero) ON DELETE SET NULL
);

CREATE TABLE SolucionPartida (
    id_partida INT PRIMARY KEY,
    id_carta_arma INT,
    id_carta_personaje INT,
    id_carta_habitacion INT,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida) ON DELETE CASCADE,
    FOREIGN KEY (id_carta_arma) REFERENCES Carta(id_carta) ON DELETE CASCADE,
    FOREIGN KEY (id_carta_personaje) REFERENCES Carta(id_carta) ON DELETE CASCADE,
    FOREIGN KEY (id_carta_habitacion) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE Jugador (
    id_jugador INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_partida INT,
    id_estado ENUM('JUGANDO', 'EXPULSADO_POR_ACUSACION', 'EXPULSADO_POR_ADMIN') DEFAULT 'JUGANDO',
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_partida) REFERENCES Partida(id_partida) ON DELETE CASCADE
);

Create table posicionJugador (
	id_jugador int primary key,
    fila int,
    columna int,
    foreign key (id_jugador) References Jugador(id_jugador) on delete cascade
);

CREATE TABLE Jugador_Carta (
    id_jugador INT,
    id_carta INT,
    PRIMARY KEY (id_jugador, id_carta),
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador) ON DELETE CASCADE,
    FOREIGN KEY (id_carta) REFERENCES Carta(id_carta) ON DELETE CASCADE
);

CREATE TABLE Acusacion (
    id_acusacion INT PRIMARY KEY AUTO_INCREMENT,
    id_jugador INT,
    id_carta_arma INT,
    id_carta_personaje INT,
    id_carta_habitacion INT,
    final BOOLEAN DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jugador) REFERENCES Jugador(id_jugador) ON DELETE CASCADE,
    FOREIGN KEY (id_carta_arma) REFERENCES Carta(id_carta) ON DELETE CASCADE,
    FOREIGN KEY (id_carta_personaje) REFERENCES Carta(id_carta) ON DELETE CASCADE,
    FOREIGN KEY (id_carta_habitacion) REFERENCES Carta(id_carta) ON DELETE CASCADE
);
