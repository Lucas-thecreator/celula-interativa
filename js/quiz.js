/* =========================================================================
   QUIZ FINAL  (quiz.js)
   -------------------------------------------------------------------------
   Junta UMA pergunta de cada organela (de data/organelas.js), mostra uma de
   cada vez com feedback em texto (nunca só por cor), conta a pontuação e, ao
   acertar tudo, libera o selo de "Cientista Celular". O progresso fica em
   localStorage (sem login).
   ========================================================================= */

(function () {
  var app = document.getElementById('quiz-app');
  if (!app) return;

  var CHAVE = 'celulas_quiz';
  var perguntas = window.ORGANELAS.map(function (o) {
    return { nome: o.nome, pergunta: o.quiz.pergunta, opcoes: o.quiz.opcoes, correta: o.quiz.correta };
  });
  var total = perguntas.length;
  var indice = 0;
  var acertos = 0;

  function recordeSalvo() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { return {}; }
  }
  function salvarRecorde(dados) {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) {}
  }

  function telaInicial() {
    var r = recordeSalvo();
    var selo = r.selo
      ? '<p class="quiz-selo-mini">🏅 Você já conquistou o selo de <strong>Cientista Celular</strong>!</p>'
      : '';
    var recorde = (typeof r.melhor === 'number')
      ? '<p>Seu melhor resultado: <strong>' + r.melhor + ' de ' + total + '</strong>.</p>'
      : '';
    app.innerHTML =
      '<div class="painel quiz-card">' +
        '<h1>🧪 Quiz da Célula</h1>' +
        '<p>São ' + total + ' perguntas, uma de cada organela, sempre ligadas à analogia da escola. ' +
        'Acerte todas para ganhar o selo de <strong>Cientista Celular</strong>!</p>' +
        selo + recorde +
        '<button class="btn-grande" id="btn-comecar">▶ Começar o quiz</button>' +
      '</div>';
    document.getElementById('btn-comecar').addEventListener('click', function () {
      indice = 0; acertos = 0; mostrarPergunta();
    });
  }

  function mostrarPergunta() {
    var q = perguntas[indice];
    app.innerHTML =
      '<div class="painel quiz-card">' +
        '<div class="quiz-progresso">' +
          '<span>Pergunta ' + (indice + 1) + ' de ' + total + '</span>' +
          '<span class="quiz-acertos">Acertos: ' + acertos + '</span>' +
        '</div>' +
        '<div class="quiz-barra" aria-hidden="true"><span style="width:' +
          Math.round((indice / total) * 100) + '%"></span></div>' +
        '<h2 class="quiz-pergunta">' + q.pergunta + '</h2>' +
        '<div class="quiz-opcoes" id="opcoes" role="group" aria-label="Escolha a resposta"></div>' +
        '<p class="quiz-feedback" id="feedback" role="status" aria-live="polite"></p>' +
        '<button class="btn-grande" id="btn-prox" hidden>Próxima ▶</button>' +
      '</div>';

    var cont = document.getElementById('opcoes');
    var feedback = document.getElementById('feedback');
    var btnProx = document.getElementById('btn-prox');

    q.opcoes.forEach(function (texto, i) {
      var b = document.createElement('button');
      b.className = 'quiz-opcao';
      b.type = 'button';
      b.textContent = texto;
      b.addEventListener('click', function () { responder(i, b); });
      cont.appendChild(b);
    });

    function responder(escolha, botao) {
      var botoes = cont.querySelectorAll('.quiz-opcao');
      botoes.forEach(function (bt, i) {
        bt.disabled = true;
        if (i === q.correta) bt.classList.add('certa');
      });
      if (escolha === q.correta) {
        acertos++;
        feedback.className = 'quiz-feedback ok';
        feedback.textContent = '✅ Resposta certa!';
      } else {
        botao.classList.add('errada');
        feedback.className = 'quiz-feedback nao';
        feedback.textContent = '❌ A resposta certa é: "' + q.opcoes[q.correta] + '".';
      }
      btnProx.textContent = (indice + 1 < total) ? 'Próxima ▶' : 'Ver resultado 🎉';
      btnProx.hidden = false;
      btnProx.focus();
    }

    btnProx.addEventListener('click', function () {
      indice++;
      if (indice < total) mostrarPergunta();
      else telaFinal();
    });
  }

  function telaFinal() {
    var ganhouTudo = (acertos === total);
    var r = recordeSalvo();
    var novoMelhor = Math.max(r.melhor || 0, acertos);
    salvarRecorde({ melhor: novoMelhor, selo: r.selo || ganhouTudo });

    var msg, emoji;
    if (ganhouTudo) { emoji = '🏆'; msg = 'Perfeito! Você é oficialmente um(a) Cientista Celular!'; }
    else if (acertos >= Math.ceil(total * 0.7)) { emoji = '🌟'; msg = 'Muito bem! Você já manda bem nas organelas.'; }
    else if (acertos >= Math.ceil(total * 0.4)) { emoji = '👍'; msg = 'Bom começo! Revise as organelas e tente de novo.'; }
    else { emoji = '🌱'; msg = 'Tudo bem! Dê mais uma olhada nas organelas e volte para o quiz.'; }

    var selo = ganhouTudo
      ? '<div class="selo" role="img" aria-label="Selo de Cientista Celular conquistado">' +
          '<span class="selo-emoji" aria-hidden="true">🏅</span>' +
          '<strong>Cientista Celular</strong>' +
          '<small>Acertou todas as ' + total + ' perguntas</small>' +
        '</div>'
      : '';

    app.innerHTML =
      '<div class="painel quiz-card quiz-final">' +
        '<div class="quiz-resultado-emoji" aria-hidden="true">' + emoji + '</div>' +
        '<h1>Você acertou ' + acertos + ' de ' + total + '!</h1>' +
        '<p>' + msg + '</p>' +
        selo +
        '<div class="quiz-final-botoes">' +
          '<button class="btn-grande" id="btn-refazer">↻ Refazer o quiz</button>' +
          '<a class="btn-sec-claro" href="index.html">Voltar ao explorador</a>' +
        '</div>' +
      '</div>';
    document.getElementById('btn-refazer').addEventListener('click', function () {
      indice = 0; acertos = 0; mostrarPergunta();
    });
  }

  telaInicial();
})();
