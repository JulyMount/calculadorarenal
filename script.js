/* script.js */

// Evento que espera o HTML carregar para executar o script
document.addEventListener("DOMContentLoaded", () => {
  
  // --- FUNÇÕES GLOBAIS ---
  
  /**
   * Configura os botões de +/- para todos os contadores da página.
   */
  function setupCounters() {
    const counters = document.querySelectorAll(".counter");
    
    counters.forEach(counter => {
      const btnMinus = counter.querySelector(".btn-minus");
      const btnPlus = counter.querySelector(".btn-plus");
      const valueSpan = counter.querySelector(".value");
      
      btnMinus.addEventListener("click", () => {
        let currentValue = parseInt(valueSpan.textContent);
        if (currentValue > 0) {
          valueSpan.textContent = currentValue - 1;
        }
      });
      
      btnPlus.addEventListener("click", () => {
        let currentValue = parseInt(valueSpan.textContent);
        valueSpan.textContent = currentValue + 1;
      });
    });
  }
  
  /**
   * Calcula a pontuação total com base nos contadores visíveis na página.
   * @returns {number} A pontuação total.
   */
  function calcularPontuacaoTotal() {
    let pontuacaoFinal = 0;
    const counters = document.querySelectorAll(".counter");
    
    counters.forEach(counter => {
      const pontos = parseInt(counter.dataset.points);
      const quantidade = parseInt(counter.querySelector(".value").textContent);
      pontuacaoFinal += (pontos * quantidade);
    });
    
    return pontuacaoFinal;
  }
  
  // --- LÓGICA DE CADA PÁGINA ---
  
  // Lógica para a página SOLO (solo.html)
  if (document.getElementById("page-solo")) {
    setupCounters(); // Ativa os botões +/-
    
    const btnCalcular = document.getElementById("btn-calcular-solo");
    const resultadoDiv = document.getElementById("resultado-final");
    
    btnCalcular.addEventListener("click", () => {
      const pontuacao = calcularPontuacaoTotal();
      resultadoDiv.textContent = `Pontuação Final: ${pontuacao}`;
      resultadoDiv.style.display = "block";
    });
  }
  
  // Lógica para a página MULTI (multi.html)
  if (document.getElementById("page-multi")) {
    const btnMinus = document.getElementById("btn-player-minus");
    const btnPlus = document.getElementById("btn-player-plus");
    const countSpan = document.getElementById("player-count");
    const btnConfirmar = document.getElementById("btn-confirmar-multi");
    
    btnMinus.addEventListener("click", () => {
      let count = parseInt(countSpan.textContent);
      if (count > 1) { // Mínimo de 1 jogador
        countSpan.textContent = count - 1;
      }
    });
    
    btnPlus.addEventListener("click", () => {
      let count = parseInt(countSpan.textContent);
      if (count < 4) { // Máximo de 4 jogadores
        countSpan.textContent = count + 1;
      }
    });
    
    btnConfirmar.addEventListener("click", () => {
      const totalJogadores = countSpan.textContent;
      
      // Limpa o localStorage para um novo jogo
      localStorage.clear();
      
      // Salva as configurações do jogo
      localStorage.setItem("totalJogadores", totalJogadores);
      localStorage.setItem("jogadorAtual", "1"); // Começa no jogador 1
      
      // Redireciona para a página do jogador
      window.location.href = "jogador.html";
    });
  }
  
  // Lógica para a página JOGADOR (jogador.html)
  if (document.getElementById("page-jogador")) {
    setupCounters(); // Ativa os botões +/-
    
    const titulo = document.getElementById("jogador-titulo");
    const btnProximo = document.getElementById("btn-proximo-jogador");
    
    // Pega os dados do jogo do localStorage
    const jogadorAtual = parseInt(localStorage.getItem("jogadorAtual") || 0);
    const totalJogadores = parseInt(localStorage.getItem("totalJogadores") || 0);
    
    // Se não houver dados (ex: usuário acessou direto), volta pra home
    if (jogadorAtual === 0 || totalJogadores === 0) {
      window.location.href = "index.html";
      return; // Para o script
    }
    
    // Atualiza a UI para o jogador atual
    titulo.textContent = `Jogador ${jogadorAtual}`;
    
    // Verifica se é o último jogador
    if (jogadorAtual < totalJogadores) {
      btnProximo.textContent = `Próximo Jogador (${jogadorAtual + 1})`;
    } else {
      btnProximo.textContent = "Ver Ranking Final";
    }
    
    // Define o que o botão faz
    btnProximo.addEventListener("click", () => {
      // 1. Calcula e salva os pontos do jogador atual
      const pontuacao = calcularPontuacaoTotal();
      localStorage.setItem(`pontos_J${jogadorAtual}`, pontuacao);
      
      // 2. Decide para onde ir
      if (jogadorAtual < totalJogadores) {
        // Ainda há jogadores, passa para o próximo
        localStorage.setItem("jogadorAtual", jogadorAtual + 1);
        // Recarrega a própria página
        window.location.reload();
      } else {
        // É o último jogador, vai para o ranking
        window.location.href = "rank.html";
      }
    });
  }
  
  // Lógica para a página RANKING (rank.html)
  if (document.getElementById("page-rank")) {
    const totalJogadores = parseInt(localStorage.getItem("totalJogadores") || 0);
    const rankingList = document.getElementById("ranking-list");
    
    if (totalJogadores === 0) {
      rankingList.innerHTML = "<li>Nenhum dado encontrado.</li>";
      return;
    }
    
    let pontuacoes = [];
    
    // Coleta todas as pontuações salvas
    for (let i = 1; i <= totalJogadores; i++) {
      const pontos = parseInt(localStorage.getItem(`pontos_J${i}`) || 0);
      pontuacoes.push({
        nome: `Jogador ${i}`,
        pontos: pontos
      });
    }
    
    // Ordena do maior para o menor
    pontuacoes.sort((a, b) => b.pontos - a.pontos);
    
    // Exibe o ranking na tela
    pontuacoes.forEach(jogador => {
      const li = document.createElement("li");
      li.innerHTML = `${jogador.nome} <span>${jogador.pontos} pontos</span>`;
      rankingList.appendChild(li);
    });
    
    // Limpa o localStorage para o próximo jogo
    localStorage.clear();
  }
  
});