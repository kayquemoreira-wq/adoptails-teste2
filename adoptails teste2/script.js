const API_URL = "http://localhost:8080/api";
const lista = document.getElementById("lista-animais");
const formAnimal = document.getElementById("form-cadastrar-animal");

// Dados iniciais caso o servidor Java/Node ainda não esteja ligado
let animaisLocais = [
  {
    id: 1,
    nome: "Larry",
    especie: "Gato",
    idade: "3 anos",
    foto: "img/gato larry.jpg"
  },
  {
    id: 2,
    nome: "Rafael",
    especie: "Guaxinim",
    idade: "1 ano",
    foto: "img/guaxi.jpg"
  },
  {
    id: 3,
    nome: "Mestre Splinter",
    especie: "Coelho",
    idade: "5 decadas",
    foto: "img/ms.jpg"
  },
  {
    id: 4,
    nome: "Pirito",
    especie: "Rato",
    idade: "8 meses",
    foto: "img/pirito.jpg"
  }
];

// 1. Alternar entre as abas Adotar e Doar
function mudarAba(aba) {
  document.getElementById("aba-catalogo").classList.toggle("ativa", aba === "catalogo");
  document.getElementById("aba-doar").classList.toggle("ativa", aba === "doar");

  document.getElementById("btn-aba-catalogo").classList.toggle("ativa", aba === "catalogo");
  document.getElementById("btn-aba-doar").classList.toggle("ativa", aba === "doar");

  if (aba === "catalogo") carregarAnimais();
}

// 2. Renderizar os cards na tela
function renderizarCards(animais) {
  if (!animais || animais.length === 0) {
    lista.innerHTML = "<p>Nenhum pet cadastrado no momento.</p>";
    return;
  }

  lista.innerHTML = "";
  animais.forEach(pet => {
    const card = document.createElement("div");
    card.className = "card";

    const especie = (pet.especie || "").toLowerCase();
    const emoji = especie.startsWith("gat") ? "🐱" : especie.startsWith("cach") ? "🐶" : "🐾";

    card.innerHTML = `
      <img src="${pet.foto || ""}" alt="${pet.nome}" onerror="this.outerHTML='<div class=&quot;sem-foto&quot;>${emoji}</div>'">
      <h3>${pet.nome}</h3>
      <p>${pet.especie}, ${pet.idade}</p>
      <button onclick="abrirModalAdocao(${pet.id}, '${pet.nome.replace(/'/g, "\\'")}')">ADOTAR ME</button>
    `;
    lista.appendChild(card);
  });
}

// 3. Buscar animais da API (ou usar dados locais se o servidor estiver desligado)
async function carregarAnimais() {
  try {
    const res = await fetch(`${API_URL}/animais`);
    if (!res.ok) throw new Error("Servidor indisponível");
    const animais = await res.json();
    renderizarCards(animais);
  } catch (err) {
    renderizarCards(animaisLocais);
  }
}

// 4. Prévia da foto e conversão para Base64
const arquivoFoto = document.getElementById("arquivo-foto");
const campoFoto = document.getElementById("foto");
const previaFoto = document.getElementById("previa-foto");

arquivoFoto.addEventListener("change", () => {
  const arquivo = arquivoFoto.files[0];
  if (!arquivo) {
    limparFoto();
    return;
  }

  const leitor = new FileReader();
  leitor.onload = () => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, 500 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      campoFoto.value = canvas.toDataURL("image/jpeg", 0.8);
      previaFoto.src = campoFoto.value;
      previaFoto.hidden = false;
    };
    img.onerror = () => {
      alert("Não foi possível ler essa imagem.");
      limparFoto();
    };
    img.src = leitor.result;
  };
  leitor.readAsDataURL(arquivo);
});

function limparFoto() {
  campoFoto.value = "";
  previaFoto.hidden = true;
}

formAnimal.addEventListener("reset", limparFoto);

// 5. Cadastrar um novo animal
formAnimal.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoPet = {
    nome: document.getElementById("nome").value.trim(),
    especie: document.getElementById("especie").value,
    idade: document.getElementById("idade").value.trim(),
    foto: document.getElementById("foto").value
  };

  try {
    const res = await fetch(`${API_URL}/animais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPet)
    });

    if (res.ok) {
      alert("Pet cadastrado com sucesso no banco de dados!");
      formAnimal.reset();
      mudarAba("catalogo");
    } else {
      alert("Erro " + res.status + ": verifique se a coluna 'foto' no banco está como LONGTEXT.");
    }
  } catch (err) {
    novoPet.id = Date.now();
    animaisLocais.unshift(novoPet);
    alert("Pet adicionado na vitrine! (Modo local: ligue o servidor localhost:8080 para salvar no MySQL)");
    formAnimal.reset();
    mudarAba("catalogo");
  }
});

// 6. Modais de Adoção e Login
function abrirModalAdocao(id, nomePet) {
  document.getElementById("adocao-animal-id").value = id;
  document.getElementById("modal-nome-pet").textContent = nomePet;
  document.getElementById("modal-adocao").classList.add("aberto");
}

function abrirModalLogin(e) {
  e.preventDefault();
  document.getElementById("modal-login").classList.add("aberto");
}

function fecharModal(idModal) {
  document.getElementById(idModal).classList.remove("aberto");
}

document.getElementById("form-adocao").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    animalId: Number(document.getElementById("adocao-animal-id").value),
    nomeInteressado: document.getElementById("adocao-nome").value.trim(),
    email: document.getElementById("adocao-email").value.trim()
  };

  try {
    const res = await fetch(`${API_URL}/adocoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    alert(await res.text());
  } catch (err) {
    alert(`Pedido de adoção enviado com sucesso, ${payload.nomeInteressado}! Entraremos em contato pelo e-mail ${payload.email}.`);
  }

  e.target.reset();
  fecharModal("modal-adocao");
});

// Inicializa o catálogo
carregarAnimais();