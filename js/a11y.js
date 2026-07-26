/* =========================================================================
   CONTROLES DE ACESSIBILIDADE  (a11y.js)
   -------------------------------------------------------------------------
   Monta a barra fixa em qualquer página que tenha <div id="a11y-bar">.

   Sempre à vista:
     A− / A+          -> diminui / aumenta o tamanho do texto
     Ler ao passar    -> fala o que está escrito no botão sob o mouse/foco
     Alto contraste   -> tema preto-e-amarelo
     Modo escuro      -> tema escuro
     Mais opções      -> abre o painel abaixo

   No painel "Mais opções":
     Fonte legível    -> troca por uma fonte sem curvas, boa para dislexia
     Menos animação   -> desliga transições e movimentos
     Realce do foco   -> contorno grosso no que está sob o mouse/foco
     Velocidade da voz-> devagar / normal / rápida
     Ler esta página  -> lê o conteúdo principal em voz alta
     Parar a leitura  -> silencia (o mesmo que apertar Esc)
     Restaurar padrão -> volta tudo ao estado original

   Tudo é salvo em localStorage e reaplicado nas próximas visitas.

   Importante: estes controles COMPLEMENTAM o leitor de tela, não o
   substituem. Os botões têm rótulo de texto (nunca só ícone) e estado
   aria-pressed para o leitor anunciar ligado/desligado.
   ========================================================================= */

(function () {
  var CHAVE = 'celulas_a11y';
  var FONTE_MIN = 0.85, FONTE_MAX = 1.9, PASSO = 0.15;
  var VELOCIDADES = { devagar: 0.75, normal: 0.95, rapida: 1.25 };

  function lerPrefs() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { return {}; }
  }
  function salvarPrefs(p) {
    try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) {}
  }

  /* -----------------------------------------------------------------------
     Aplicar preferências na página
     ----------------------------------------------------------------------- */
  function aplicarPrefs(p) {
    var raiz = document.documentElement;
    raiz.style.setProperty('--font-scale', p.fonte || 1);
    raiz.classList.toggle('hc', !!p.contraste);
    raiz.classList.toggle('escuro', !!p.escuro);
    raiz.classList.toggle('fonte-legivel', !!p.fonteLegivel);
    raiz.classList.toggle('menos-anima', !!p.menosAnima);
    raiz.classList.toggle('realce', !!p.realce);

    // Velocidade da voz (lida pelo tts.js a cada fala).
    if (window.FalaConfig) {
      window.FalaConfig.velocidade = VELOCIDADES[p.velocidade || 'normal'] || VELOCIDADES.normal;
    }

    // Leitura ao passar o mouse / focar pelo teclado.
    if (window.LeituraAoPassar) {
      if (p.lerPassar) window.LeituraAoPassar.ligar();
      else window.LeituraAoPassar.desligar();
    }

    marcar('btn-contraste', !!p.contraste);
    marcar('btn-escuro', !!p.escuro);
    marcar('btn-ler-passar', !!p.lerPassar);
    marcar('btn-fonte-legivel', !!p.fonteLegivel);
    marcar('btn-menos-anima', !!p.menosAnima);
    marcar('btn-realce', !!p.realce);

    Object.keys(VELOCIDADES).forEach(function (v) {
      marcar('btn-vel-' + v, (p.velocidade || 'normal') === v);
    });
  }

  function marcar(id, ligado) {
    var b = document.getElementById(id);
    if (b) b.setAttribute('aria-pressed', ligado ? 'true' : 'false');
  }

  /* Avisa o que acabou de mudar: por escrito (para todos) e, se a leitura
     por voz estiver ligada, também em áudio. */
  var limpaAviso = null;
  function avisar(texto, falarTambem) {
    var caixa = document.getElementById('a11y-aviso');
    if (caixa) {
      caixa.textContent = texto;
      if (limpaAviso) clearTimeout(limpaAviso);
      limpaAviso = setTimeout(function () { caixa.textContent = ''; }, 5000);
    }
    if (falarTambem && typeof window.falar === 'function') window.falar(texto);
  }

  function textoDaPagina() {
    var alvo = document.getElementById('conteudo') || document.querySelector('main');
    if (!alvo) return '';
    var copia = alvo.cloneNode(true);
    copia.querySelectorAll('[aria-hidden="true"], svg, script, style, .skip-link').forEach(function (n) {
      n.parentNode.removeChild(n);
    });
    // Tira emojis e setas antes de falar (senão a voz tenta pronunciá-los).
    var limpar = (window.LeituraAoPassar && window.LeituraAoPassar.limparTexto) ||
                 function (s) { return String(s).replace(/\s+/g, ' ').trim(); };
    return limpar(copia.textContent).slice(0, 4000);
  }

  /* -----------------------------------------------------------------------
     Montagem da barra
     ----------------------------------------------------------------------- */
  function montar() {
    var bar = document.getElementById('a11y-bar');
    if (!bar) return;

    bar.innerHTML =
      '<div class="conteiner" role="group" aria-label="Controles de acessibilidade">' +
        '<span class="rotulo">♿ Acessibilidade:</span>' +
        '<button class="btn-a11y" id="btn-fonte-menos" aria-label="Diminuir o tamanho do texto">A−</button>' +
        '<button class="btn-a11y" id="btn-fonte-mais" aria-label="Aumentar o tamanho do texto">A+</button>' +
        '<button class="btn-a11y" id="btn-ler-passar" aria-pressed="false" ' +
          'data-falar="Ler ao passar o mouse. Toque para ligar ou desligar.">🔊 Ler ao passar</button>' +
        '<button class="btn-a11y" id="btn-contraste" aria-pressed="false">Alto contraste</button>' +
        '<button class="btn-a11y" id="btn-escuro" aria-pressed="false">Modo escuro</button>' +
        '<button class="btn-a11y mais" id="btn-mais" aria-expanded="false" aria-controls="a11y-mais">⚙️ Mais opções</button>' +
        '<p class="a11y-aviso" id="a11y-aviso" role="status" aria-live="polite"></p>' +
      '</div>' +

      '<div class="a11y-painel" id="a11y-mais" hidden>' +
        '<div class="conteiner">' +
          '<div class="a11y-grupo">' +
            '<span class="grupo-rotulo" id="rot-leitura">Leitura:</span>' +
            '<button class="btn-a11y" id="btn-fonte-legivel" aria-pressed="false">🔤 Fonte legível</button>' +
            '<button class="btn-a11y" id="btn-menos-anima" aria-pressed="false">🎬 Menos animação</button>' +
            '<button class="btn-a11y" id="btn-realce" aria-pressed="false">🖱️ Realce do foco</button>' +
          '</div>' +

          '<div class="a11y-grupo" role="group" aria-label="Velocidade da voz">' +
            '<span class="grupo-rotulo">Velocidade da voz:</span>' +
            '<button class="btn-a11y" id="btn-vel-devagar" aria-pressed="false">🐢 Devagar</button>' +
            '<button class="btn-a11y" id="btn-vel-normal" aria-pressed="true">Normal</button>' +
            '<button class="btn-a11y" id="btn-vel-rapida" aria-pressed="false">🐇 Rápida</button>' +
          '</div>' +

          '<div class="a11y-grupo">' +
            '<span class="grupo-rotulo">Áudio:</span>' +
            '<button class="btn-a11y" id="btn-ler-pagina">▶️ Ler esta página</button>' +
            '<button class="btn-a11y" id="btn-parar-audio">🔇 Parar a leitura</button>' +
            '<button class="btn-a11y" id="btn-restaurar">↺ Restaurar o padrão</button>' +
          '</div>' +

          '<p class="a11y-dica">💡 Com <strong>Ler ao passar</strong> ligado, é só parar o mouse ' +
            '(ou ir com a tecla Tab) em cima de um botão que o site fala o que está escrito nele. ' +
            'Aperte <kbd>Esc</kbd> a qualquer momento para o áudio parar.</p>' +
        '</div>' +
      '</div>';

    var prefs = lerPrefs();

    function alternar(campo, ligar) {
      prefs[campo] = (typeof ligar === 'boolean') ? ligar : !prefs[campo];
      salvarPrefs(prefs);
      aplicarPrefs(prefs);
      return prefs[campo];
    }

    /* ---- Tamanho do texto ---- */
    document.getElementById('btn-fonte-mais').addEventListener('click', function () {
      prefs.fonte = Math.min((prefs.fonte || 1) + PASSO, FONTE_MAX);
      salvarPrefs(prefs); aplicarPrefs(prefs);
      avisar('Texto maior: ' + Math.round(prefs.fonte * 100) + '%.', prefs.lerPassar);
    });
    document.getElementById('btn-fonte-menos').addEventListener('click', function () {
      prefs.fonte = Math.max((prefs.fonte || 1) - PASSO, FONTE_MIN);
      salvarPrefs(prefs); aplicarPrefs(prefs);
      avisar('Texto menor: ' + Math.round(prefs.fonte * 100) + '%.', prefs.lerPassar);
    });

    /* ---- Ler ao passar o mouse ----
       O clique aqui é um gesto do usuário: é justamente ele que "libera" a
       voz do navegador em celulares, por isso já falamos a confirmação. */
    document.getElementById('btn-ler-passar').addEventListener('click', function () {
      var ligado = alternar('lerPassar');
      if (ligado) {
        avisar('Leitura ao passar o mouse ligada. Pare o mouse em cima de um botão para ouvir.', true);
      } else {
        avisar('Leitura ao passar o mouse desligada.', false);
      }
    });

    /* ---- Temas ---- */
    document.getElementById('btn-contraste').addEventListener('click', function () {
      var ligado = alternar('contraste');
      if (ligado) alternar('escuro', false);  // não faz sentido os dois juntos
      avisar('Alto contraste ' + (ligado ? 'ligado' : 'desligado') + '.', prefs.lerPassar);
    });
    document.getElementById('btn-escuro').addEventListener('click', function () {
      var ligado = alternar('escuro');
      if (ligado) alternar('contraste', false);
      avisar('Modo escuro ' + (ligado ? 'ligado' : 'desligado') + '.', prefs.lerPassar);
    });

    /* ---- Painel "Mais opções" ---- */
    var btnMais = document.getElementById('btn-mais');
    var painel = document.getElementById('a11y-mais');
    btnMais.addEventListener('click', function () {
      var aberto = btnMais.getAttribute('aria-expanded') === 'true';
      btnMais.setAttribute('aria-expanded', aberto ? 'false' : 'true');
      painel.hidden = aberto;
    });

    document.getElementById('btn-fonte-legivel').addEventListener('click', function () {
      var ligado = alternar('fonteLegivel');
      avisar('Fonte legível ' + (ligado ? 'ligada' : 'desligada') + '.', prefs.lerPassar);
    });
    document.getElementById('btn-menos-anima').addEventListener('click', function () {
      var ligado = alternar('menosAnima');
      avisar('Menos animação ' + (ligado ? 'ligado' : 'desligado') + '.', prefs.lerPassar);
    });
    document.getElementById('btn-realce').addEventListener('click', function () {
      var ligado = alternar('realce');
      avisar('Realce do foco ' + (ligado ? 'ligado' : 'desligado') + '.', prefs.lerPassar);
    });

    /* ---- Velocidade da voz ---- */
    Object.keys(VELOCIDADES).forEach(function (v) {
      var b = document.getElementById('btn-vel-' + v);
      if (!b) return;
      b.addEventListener('click', function () {
        prefs.velocidade = v;
        salvarPrefs(prefs); aplicarPrefs(prefs);
        avisar('Velocidade da voz: ' + b.textContent.replace(/[^\wÀ-ÿ ]/g, '').trim().toLowerCase() + '.', true);
      });
    });

    /* ---- Áudio ---- */
    document.getElementById('btn-ler-pagina').addEventListener('click', function () {
      var texto = textoDaPagina();
      if (!texto) { avisar('Não encontrei texto para ler nesta página.', false); return; }
      if (typeof window.falar !== 'function') {
        avisar('Seu navegador não tem leitura por voz.', false);
        return;
      }
      avisar('Lendo a página. Aperte Esc para parar.', false);
      window.falar(texto);
    });

    document.getElementById('btn-parar-audio').addEventListener('click', function () {
      if (typeof window.pararFala === 'function') window.pararFala();
      if (window.AudioFala) { try { window.AudioFala.parar(); } catch (e) {} }
      avisar('Áudio parado.', false);
    });

    document.getElementById('btn-restaurar').addEventListener('click', function () {
      Object.keys(prefs).forEach(function (k) { delete prefs[k]; });
      salvarPrefs(prefs);
      aplicarPrefs(prefs);
      if (typeof window.pararFala === 'function') window.pararFala();
      avisar('Tudo voltou ao padrão.', false);
    });

    aplicarPrefs(prefs);
  }

  // Aplica as preferências o quanto antes para evitar "piscar" sem o tema.
  aplicarPrefs(lerPrefs());
  document.addEventListener('DOMContentLoaded', montar);
})();
