CREATE DATABASE IF NOT EXISTS adoptails;

USE adoptails;

CREATE TABLE IF NOT EXISTS animal (
  id       BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome     VARCHAR(100) NOT NULL,
  especie  VARCHAR(50)  NOT NULL,
  idade    VARCHAR(50),
  foto     LONGTEXT,
  adotado  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS adocao (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  animal_id        BIGINT NOT NULL,
  nome_interessado VARCHAR(150) NOT NULL,
  email            VARCHAR(150) NOT NULL,
  FOREIGN KEY (animal_id) REFERENCES animal(id)
);

-- Dados iniciais com adotado = FALSE para aparecerem na vitrine
INSERT INTO animal (nome, especie, idade, foto, adotado) VALUES
  ('Larry',  'Gato',     '3 anos',  'images/gato larry.jpg',  FALSE),
  ('Rafael',  'Guaxinim', '1 ano',   'images/guaxi.jpg',  FALSE),
  ('Mestre Splinter',   'Coelho', '5 decadas', 'images/ms.jpg',   FALSE),
  ('Pirito', 'Rato',     '8 meses', 'images/pirito.jpg', FALSE);