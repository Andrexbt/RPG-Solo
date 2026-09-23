"use strict";

// Cabeçalho e rodapé compartilhados pelas páginas comuns do site.
(function montarEstruturaSite() {
  const cabecalho = document.querySelector("[data-site-header]");
  const rodape = document.querySelector("[data-site-footer]");
  const linkInicio = document.getElementById("inicio") ? "#inicio" : "index.html";

  if (cabecalho) {
    cabecalho.innerHTML = `
      <a class="marca" href="index.html">
        <img class="marca-nome" src="assets/home/logo-taverna-da-esfinge-tipografico.webp" alt="Taverna da Esfinge" />
      </a>

      <nav class="menu-principal" aria-label="Navegação principal">
        <a href="${linkInicio}">Início</a>
        <a href="criacao-personagem.html">Criar Personagem</a>
        <a href="meus-personagens.html">Meus Personagens</a>
        <a href="aventuras-disponiveis.html">Aventuras</a>
        <a href="area-mestre.html" data-acesso-area-mestre hidden>Área do Mestre</a>
      </nav>

      <div class="perfil-reservado" aria-label="Espaço reservado para o perfil do usuário">
        Perfil - Em Breve
      </div>`;
  }

  if (rodape) {
    rodape.innerHTML = `
      <div class="rodape-conteudo">
        <nav class="rodape-coluna" aria-label="Explorar">
          <h2>Explorar</h2>
          <a href="index.html">Início</a>
          <a href="aventuras-disponiveis.html">Aventuras</a>
        </nav>

        <nav class="rodape-coluna" aria-label="Personagens">
          <h2>Personagens</h2>
          <a href="criacao-personagem.html">Criar Personagem</a>
          <a href="meus-personagens.html">Meus Personagens</a>
        </nav>

        <nav class="rodape-coluna" aria-label="A Taverna">
          <h2>A Taverna</h2>
          <a href="nossa-missao.html">Nossa Missão</a>
          <a href="atualizacoes-desenvolvimento.html">Atualizações</a>
        </nav>
      </div>

      <div class="rodape-inferior">
        <span>
          Este site utiliza e adapta material do
          <a href="https://www.dndbeyond.com/srd">SRD 5.2.1</a>, de Wizards of the Coast LLC, sob a
          licença <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
        </span>
        <span>© 2026 Taverna da Esfinge. Todos os direitos reservados.</span>
      </div>`;
  }
})();
