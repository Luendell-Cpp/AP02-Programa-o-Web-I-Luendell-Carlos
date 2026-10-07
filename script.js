/* ===== Referências aos elementos ===== */
const formulario = document.getElementById("formulario");
const campoDescricao = document.getElementById("descricao");
const campoValor = document.getElementById("valor");
const campoCategoria = document.getElementById("categoria");
const mensagemErro = document.getElementById("mensagem-erro");
const lista = document.getElementById("lista");
const filtro = document.getElementById("filtro");
const painelTotal = document.getElementById("total");
const contador = document.getElementById("contador");
const botaoModo = document.getElementById("botao-modo");

function formatarValor(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function classificarTotal(total) {
  if (total > 1000) {
    return "vermelho";
  }
  if (total > 500) {
    return "amarelo";
  }
  return "verde";
}

function categoriaVisivel(categoriaItem, categoriaFiltro) {
  return categoriaFiltro === "Todas" || categoriaItem === categoriaFiltro;
}

function textoContador(quantidade) {
  if (quantidade === 1) {
    return "1 gasto registrado";
  }
  return quantidade + " gastos registrados";
}

function mostrarErro(texto, campo) {
  mensagemErro.textContent = texto;
  campo.classList.add("invalido");
}

function limparErros() {
  mensagemErro.textContent = "";
  campoDescricao.classList.remove("invalido");
  campoValor.classList.remove("invalido");
}

function validarFormulario(descricao, valorTexto) {
  limparErros();

  if (descricao === "") {
    mostrarErro("Informe a descrição do gasto.", campoDescricao);
    return null;
  }
  if (valorTexto === "") {
    mostrarErro("Informe o valor do gasto.", campoValor);
    return null;
  }

  const valor = Number(valorTexto);
  if (Number.isNaN(valor) || valor <= 0) {
    mostrarErro("O valor deve ser maior que zero.", campoValor);
    return null;
  }
  return valor;
}

function criarItem(descricao, categoria, valor) {
  const item = document.createElement("li");
  item.classList.add("gasto");
  item.setAttribute("data-valor", valor);
  item.setAttribute("data-categoria", categoria);

  const spanDescricao = document.createElement("span");
  spanDescricao.classList.add("descricao");
  spanDescricao.textContent = descricao;

  const spanCategoria = document.createElement("span");
  spanCategoria.classList.add("categoria");
  spanCategoria.textContent = categoria;

  const spanValor = document.createElement("span");
  spanValor.classList.add("valor");
  spanValor.textContent = formatarValor(valor);

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.classList.add("remover");
  botaoRemover.textContent = "Remover";
  botaoRemover.setAttribute("aria-label", "Remover gasto " + descricao);

  item.appendChild(spanDescricao);
  item.appendChild(spanCategoria);
  item.appendChild(spanValor);
  item.appendChild(botaoRemover);
  return item;
}

function aplicarFiltroNoItem(item) {
  const categoriaItem = item.getAttribute("data-categoria");
  const visivel = categoriaVisivel(categoriaItem, filtro.value);
  if (visivel) {
    item.classList.remove("oculto");
  } else {
    item.classList.add("oculto");
  }
}

function aplicarFiltro() {
  const itens = lista.children;
  for (let i = 0; i < itens.length; i++) {
    aplicarFiltroNoItem(itens[i]);
  }
}

function atualizarTotal() {
  const itens = lista.children;
  let total = 0;
  for (let i = 0; i < itens.length; i++) {
    total += Number(itens[i].getAttribute("data-valor"));
  }

  painelTotal.textContent = formatarValor(total);
  painelTotal.classList.remove("verde", "amarelo", "vermelho");
  painelTotal.classList.add(classificarTotal(total));
}

function atualizarContador() {
  contador.textContent = textoContador(lista.children.length);
}

function atualizarResumo() {
  atualizarTotal();
  atualizarContador();
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const descricao = campoDescricao.value.trim();
  const valor = validarFormulario(descricao, campoValor.value.trim());
  if (valor === null) {
    return;
  }

  const item = criarItem(descricao, campoCategoria.value, valor);
  lista.appendChild(item);
  aplicarFiltroNoItem(item);
  atualizarResumo();

  campoDescricao.value = "";
  campoValor.value = "";
  limparErros();
  campoDescricao.focus();
});

lista.addEventListener("click", function (evento) {
  const alvo = evento.target;
  if (alvo.classList.contains("remover")) {
    alvo.closest("li").remove();
    atualizarResumo();
  }
});

filtro.addEventListener("change", aplicarFiltro);

botaoModo.addEventListener("click", function () {
  const ativo = document.body.classList.toggle("escuro");
  botaoModo.setAttribute("aria-pressed", ativo);
  botaoModo.textContent = ativo ? "Modo claro" : "Modo escuro";
});

atualizarResumo();
