/* =========================================================================
   PÁGINA DA ORGANELA  (organela.js)
   -------------------------------------------------------------------------
   Lê o ?id= da URL e monta a página a partir de data/organelas.js:
     imagem (com placeholder) · botão de áudio · resumo · analogia da escola ·
     função na célula · mini-quiz de 1 pergunta · navegação Anterior/Próxima.

   O parâmetro opcional &celula=animal|vegetal define dentro de qual conjunto
   o "Anterior/Próxima" navega (quem escaneou um QR sem esse parâmetro navega
   por todas as organelas).
   ========================================================================= */

(function () {
  var alvo = document.getElementById('organela');
  if (!alvo) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  var celula = params.get('celula');
  var o = window.getOrganela(id);

  if (!o) {
    alvo.innerHTML =
      '<div class="painel"><h1>Organela não encontrada</h1>' +
      '<p>Confira o QR Code ou volte para a <a href="index.html">página inicial</a>.</p></div>';
    return;
  }

  document.title = o.nome + ' • Célula Interativa';

  // Conjunto para navegar (animal/vegetal) ou todas, mantendo a ordem.
  var conjunto = (celula === 'animal' || celula === 'vegetal')
    ? window.organelasPorCelula(celula)
    : window.ORGANELAS;
  var idx = conjunto.findIndex(function (x) { return x.id === o.id; });
  var anterior = conjunto[(idx - 1 + conjunto.length) % conjunto.length];
  var proxima  = conjunto[(idx + 1) % conjunto.length];
  var sufixo = celula ? '&celula=' + celula : '';

  var tags = o.celulas.map(function (t) {
    return '<span class="pill">' + (t === 'animal' ? 'Célula animal' : 'Célula vegetal') + '</span>';
  }).join('');

  alvo.innerHTML =
    '<a class="voltar" href="index.html">← Voltar para o explorador</a>' +

    '<div class="organela-topo">' +
      '<h1>' + o.nome + '</h1>' +
      '<p class="apelido-grande">Na escola, é ' + o.apelido + '.</p>' +
      '<div class="organela-tags">' + tags + '</div>' +
    '</div>' +

    '<div class="painel">' +
      '<div class="visu">' +
        '<img id="visu-img" class="visu-img" alt="">' +
      '</div>' +
      '<p class="visu-legenda">Foto do protótipo. Passe o dedo ou o mouse para ver de outro ângulo.</p>' +
    '</div>' +

    '<div class="player">' +
      '<p class="player-titulo">🔊 Explicação em áudio</p>' +
      '<div class="botoes">' +
        '<button class="btn-play" id="btn-ouvir">▶ Ouvir explicação</button>' +
        '<button class="btn-sec" id="btn-pausar">⏸ Pausar</button>' +
        '<button class="btn-sec" id="btn-repetir">↻ Repetir</button>' +
      '</div>' +
      '<p class="estado" id="estado-audio" role="status" aria-live="polite"></p>' +
    '</div>' +

    '<div class="painel texto-apoio">' +
      '<p class="destaque">💡 <strong>Resumindo:</strong> ' + o.resumo + '</p>' +
      '<h2>A analogia da escola</h2>' +
      '<p id="texto-analogia">' + o.analogia + '</p>' +
      '<h2>Função na célula</h2>' +
      '<p>' + o.funcao + '</p>' +
    '</div>' +

    '<div class="painel mini-quiz" id="mini-quiz" aria-labelledby="mini-quiz-titulo">' +
      '<h2 id="mini-quiz-titulo">🧠 Teste rápido</h2>' +
      '<p class="quiz-pergunta">' + o.quiz.pergunta + '</p>' +
      '<div class="quiz-opcoes" id="quiz-opcoes" role="group" aria-label="Escolha a resposta"></div>' +
      '<p class="quiz-feedback" id="quiz-feedback" role="status" aria-live="polite"></p>' +
    '</div>' +

    '<nav class="nav-organelas" aria-label="Navegar entre organelas">' +
      '<a class="btn-nav" href="organela.html?id=' + anterior.id + sufixo + '">' +
        '◀ <span><small>Anterior</small>' + anterior.nome + '</span></a>' +
      '<a class="btn-nav prox" href="organela.html?id=' + proxima.id + sufixo + '">' +
        '<span><small>Próxima</small>' + proxima.nome + '</span> ▶</a>' +
    '</nav>';

  /* ---- Imagem: placeholder quando não há foto + leve efeito 3D ---- */
  var img = document.getElementById('visu-img');
  img.alt = 'Foto 3D da organela ' + o.nome;
  img.src = o.img;
  img.addEventListener('error', function () {
    var div = document.createElement('div');
    div.className = 'placeholder-img visu-placeholder';
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label', 'Imagem de ' + o.nome + ' (foto ainda não adicionada)');
    div.innerHTML = '<span class="ph-emoji" aria-hidden="true">' + o.emoji + '</span>' +
                    '<span>' + o.nome + '</span>';
    img.replaceWith(div);
  });
  ativarInclinacao(document.querySelector('.visu'));

  /* ---- Áudio ---- */
  var estado = document.getElementById('estado-audio');
  function mostrarEstado(e) {
    if (e === 'tocando') estado.textContent = '🎧 Tocando a explicação…';
    else if (e === 'pausado') estado.textContent = '⏸ Pausado (toque em Repetir para recomeçar).';
    else if (e === 'fim') estado.textContent = '✅ Explicação concluída.';
    else if (e === 'sem-suporte') estado.textContent = 'Seu navegador não tem leitura por voz. O texto está logo abaixo.';
    else estado.textContent = '';
  }
  window.AudioFala.configurar(o, mostrarEstado);
  document.getElementById('btn-ouvir').addEventListener('click', function () { window.AudioFala.reiniciar(); });
  document.getElementById('btn-pausar').addEventListener('click', function () { window.AudioFala.pausar(); });
  document.getElementById('btn-repetir').addEventListener('click', function () { window.AudioFala.reiniciar(); });

  /* ---- Mini-quiz (1 pergunta) ---- */
  montarMiniQuiz(o.quiz);

  function montarMiniQuiz(quiz) {
    var cont = document.getElementById('quiz-opcoes');
    var feedback = document.getElementById('quiz-feedback');
    quiz.opcoes.forEach(function (texto, i) {
      var b = document.createElement('button');
      b.className = 'quiz-opcao';
      b.type = 'button';
      b.textContent = texto;
      b.addEventListener('click', function () { responder(i, b); });
      cont.appendChild(b);
    });

    function responder(escolha, botao) {
      var botoesQuiz = cont.querySelectorAll('.quiz-opcao');
      botoesQuiz.forEach(function (bt, i) {
        bt.disabled = true;
        if (i === quiz.correta) bt.classList.add('certa');
      });
      if (escolha === quiz.correta) {
        botao.classList.add('certa');
        feedback.className = 'quiz-feedback ok';
        feedback.textContent = '✅ Isso mesmo! Resposta certa.';
      } else {
        botao.classList.add('errada');
        feedback.className = 'quiz-feedback nao';
        feedback.textContent = '❌ Quase! A resposta certa é: "' + quiz.opcoes[quiz.correta] + '".';
      }
    }
  }

  /* Efeito leve de inclinação 3D ao mover o dedo/mouse sobre a imagem.
     Respeita quem prefere menos animação. */
  function ativarInclinacao(area) {
    if (!area || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    function mover(x, y) {
      var el = area.querySelector('img'); if (!el) return;
      var r = area.getBoundingClientRect();
      var px = (x - r.left) / r.width - 0.5;
      var py = (y - r.top) / r.height - 0.5;
      el.style.transform = 'rotateY(' + (px * 14) + 'deg) rotateX(' + (-py * 14) + 'deg) scale(1.04)';
    }
    function reset() { var el = area.querySelector('img'); if (el) el.style.transform = ''; }
    area.addEventListener('mousemove', function (e) { mover(e.clientX, e.clientY); });
    area.addEventListener('mouseleave', reset);
    area.addEventListener('touchmove', function (e) {
      if (e.touches[0]) mover(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    area.addEventListener('touchend', reset);
  }
})();
