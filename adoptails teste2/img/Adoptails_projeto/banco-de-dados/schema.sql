
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


INSERT INTO animal (nome, especie, idade, foto, adotado) VALUES
  ('Luna',  'Gata',     '3 anos',  'images/luna.jpg',  FALSE),
  ('Tico',  'Cachorro', '1 ano',   'images/tico.jpg',  FALSE),
  ('Mel',   'Cachorro', '5 meses', 'images/mel.jpg',   FALSE),
  ('Simba', 'Gato',     '8 meses', 'images/simba.jpg',  FALSE);

-- SELECT * FROM animal WHERE adotado = FALSE;
-- SELECT a.nome, p.nome_interessado, p.email FROM adocao p JOIN animal a ON a.id = p.animal_id;