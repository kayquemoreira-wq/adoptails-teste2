const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORTA = 8080;
const ARQUIVO_ANIMAIS = path.join(__dirname, 'animais.json');
const ARQUIVO_ADOCOES = path.join(__dirname, 'adocoes.json');

app.use(express.json({ limit: '10mb' }));

app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

if (!fs.existsSync(ARQUIVO_ANIMAIS)) {
  const iniciais = [
    { id: 1, nome: "Larry", especie: "Gato", idade: "3 anos", foto: "img/gato larry.jpg", adotado: false },
    { id: 2, nome: "Rafael", especie: "Outro", idade: "1 ano", foto: "img/guaxi.jpg", adotado: false },
    { id: 3, nome: "Mestre Splinter", especie: "Outro", idade: "5 decadas", foto: "img/ms.jpg", adotado: false },
    { id: 4, nome: "Pirito", especie: "Outro", idade: "8 meses", foto: "img/pirito.jpg", adotado: false },
    { id: 5, nome: "Pipoca", especie: "Cachorro", idade: "2 anos", foto: "img/pipoca.jpg", adotado: false }
  ];
  fs.writeFileSync(ARQUIVO_ANIMAIS, JSON.stringify(iniciais, null, 2));
}

if (!fs.existsSync(ARQUIVO_ADOCOES)) {
  fs.writeFileSync(ARQUIVO_ADOCOES, '[]');
}

// 1. Rota GET que o seu carregarAnimais() chama
app.get('/api/animais', (req, res) => {
  const dados = JSON.parse(fs.readFileSync(ARQUIVO_ANIMAIS, 'utf8'));
  res.json(dados);
});

app.post('/api/animais', (req, res) => {
  const lista = JSON.parse(fs.readFileSync(ARQUIVO_ANIMAIS, 'utf8'));
  
  const novoPet = {
    id: Date.now(),
    nome: req.body.nome,
    especie: req.body.especie,
    idade: req.body.idade,
    foto: req.body.foto || "",
    adotado: false
  };

  lista.unshift(novoPet); // Adiciona no início, igual ao seu script.js
  fs.writeFileSync(ARQUIVO_ANIMAIS, JSON.stringify(lista, null, 2));
  
  res.status(201).json(novoPet);
});

// 3. Rota POST para o formulário de adoção (bônus para o modal também funcionar)
app.post('/api/adocoes', (req, res) => {
  const adocoes = JSON.parse(fs.readFileSync(ARQUIVO_ADOCOES, 'utf8'));
  adocoes.push({
    id: Date.now(),
    ...req.body,
    data: new Date().toISOString()
  });
  fs.writeFileSync(ARQUIVO_ADOCOES, JSON.stringify(adocoes, null, 2));
  res.send(`Pedido de adoção enviado com sucesso, ${req.body.nomeInteressado}!`);
});

app.listen(PORTA, () => {
  console.log(`Servidor Adoptails rodando em http://localhost:${PORTA}`);
});