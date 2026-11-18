
USE adoptails;

INSERT INTO animal (nome, especie, idade, foto, adotado) VALUES
  ('Luna',  'Gata',     '3 anos',  'images/luna.jpg',  FALSE),
  ('Tico',  'Cachorro', '1 ano',   'images/tico.jpg',  FALSE),
  ('Mel',   'Cachorro', '5 meses', 'images/mel.jpg',   FALSE),
  ('Simba', 'Gato',     '8 meses', 'images/simba.jpg',  FALSE);

-- SELECT * FROM animal WHERE adotado = FALSE;
-- SELECT a.nome, p.nome_interessado, p.email FROM adocao p JOIN animal a ON a.id = p.animal_id;
