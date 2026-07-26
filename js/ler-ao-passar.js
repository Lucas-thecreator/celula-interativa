/* =========================================================================
   LER AO PASSAR  (ler-ao-passar.js)
   -------------------------------------------------------------------------
   Quando o recurso está LIGADO, o site fala em voz alta o que está escrito
   no botão/link em que o usuário parou o mouse — ou que recebeu o foco pelo
   teclado (Tab). Isso ajuda quem tem baixa visão, dislexia, dificuldade de
   leitura ou está aprendendo a ler, sem precisar instalar leitor de tela.

   Decisões de acessibilidade importantes:
   - NASCE DESLIGADO. Áudio que começa sozinho atrapalha mais do que ajuda.
   - Vale para o MOUSE e para o TECLADO. Se só respondesse ao mouse, quem
     navega por Tab (muita gente com deficiência visual) ficaria de fora.
   - Espera um instante (ATRASO) antes de falar. Sem isso, arrastar o mouse
     pela tela dispararia dezenas de falas em sequência.
   - No TOQUE (celular/tablet) não dispara: lá o dedo que "passa" é o mesmo
     que clica, então falar no toque bagunçaria a navegação.
   - Nunca atropela a explicação da organela: se aquele áudio está tocando,
     a leitura por hover fica quieta.
   - Esc para tudo, a qualquer momento.

   API exposta:
     LeituraAoPassar.ligar()      -> ativa
     LeituraAoPassar.desligar()   -> desativa e silencia
     LeituraAoPassar.estaLigada() -> boolean
   ========================================================================= */

(function () {
  var ATRASO = 180;   // ms parado sobre o elemento antes de falar
  var LIMITE = 260;   // corta textos muito longos (ninguém quer ouvir um parágrafo)

  /* O que é "falável": tudo que a pessoa pode clicar, focar ou preencher,
     mais qualquer elemento que o autor marque com data-falar. */
  var SELETOR = [
    'a[href]',
    'button',
    'summary',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[data-falar]'
  ].join(',');

  var ligada = false;
  var temporizador = null;
  var ultimoAlvo = null;   // evita repetir a mesma fala sem parar

  /* ---------------------------------------------------------------------
     Descobrir O QUE está escrito no elemento
     Segue a mesma ordem que um leitor de tela usa para achar o "nome
     acessível": rótulo explícito primeiro, texto visível depois.
     --------------------------------------------------------------------- */

  /* Emojis e setinhas são enfeite visual: a voz não deve tentar pronunciá-los
     (sai "engrenagem", "seta para a esquerda"... e atrapalha a compreensão). */
  var ENFEITES = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{FE0F}\u{200D}\u{20E3}]/gu;

  function limpar(s) {
    return String(s || '').replace(ENFEITES, ' ').replace(/\s+/g, ' ').trim();
  }

  function textoVisivel(el) {
    // Clona para poder remover ícones decorativos sem mexer na página real.
    var copia = el.cloneNode(true);
    copia.querySelectorAll('[aria-hidden="true"], svg, script, style').forEach(function (n) {
      n.parentNode.removeChild(n);
    });
    /* Sem isso, um cartão com <h3>Título</h3><p>Texto</p> viraria
       "TítuloTexto" grudado. O espaço extra some no limpar(). */
    copia.querySelectorAll('*').forEach(function (n) {
      n.appendChild(document.createTextNode(' '));
    });
    return limpar(copia.textContent);
  }

  function nomeAcessivel(el) {
    if (el.getAttribute('aria-label')) return limpar(el.getAttribute('aria-label'));

    var ids = el.getAttribute('aria-labelledby');
    if (ids) {
      var partes = ids.split(/\s+/).map(function (id) {
        var ref = document.getElementById(id);
        return ref ? textoVisivel(ref) : '';
      }).filter(Boolean);
      if (partes.length) return limpar(partes.join(' '));
    }

    var visivel = textoVisivel(el);
    if (visivel) return visivel;

    var img = el.querySelector('img[alt]');
    if (img && limpar(img.getAttribute('alt'))) return limpar(img.getAttribute('alt'));

    if (el.getAttribute('title')) return limpar(el.getAttribute('title'));
    if (el.value) return limpar(el.value);
    if (el.getAttribute('placeholder')) return limpar(el.getAttribute('placeholder'));
    return '';
  }

  /* Estado do controle, dito em português simples ("ligado", "aberto"...).
     Sem isso a pessoa ouve "Alto contraste" e não sabe se já está ativo. */
  function estadoEmPalavras(el) {
    var partes = [];
    var pressionado = el.getAttribute('aria-pressed');
    if (pressionado === 'true') partes.push('ligado');
    else if (pressionado === 'false') partes.push('desligado');

    var aberto = el.getAttribute('aria-expanded');
    if (aberto === 'true') partes.push('aberto');
    else if (aberto === 'false') partes.push('fechado');

    if (el.getAttribute('aria-current') === 'page') partes.push('você está nesta página');
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') partes.push('indisponível agora');

    return partes.length ? ', ' + partes.join(', ') : '';
  }

  function frasePara(el) {
    // data-falar manda em tudo: é o texto exato que o autor quer ouvir.
    var manual = el.getAttribute('data-falar');
    if (manual) return limpar(manual).slice(0, LIMITE);

    var nome = nomeAcessivel(el);
    if (!nome) return '';
    if (nome.length > LIMITE) nome = nome.slice(0, LIMITE) + '…';

    var estado = estadoEmPalavras(el);
    if (estado) return nome.replace(/[.:;,]+$/, '') + estado + '.';
    return /[.!?…]$/.test(nome) ? nome : nome + '.';
  }

  /* ---------------------------------------------------------------------
     Falar / parar
     --------------------------------------------------------------------- */

  function outroAudioTocando() {
    return !!(window.AudioFala &&
              typeof window.AudioFala.estaTocando === 'function' &&
              window.AudioFala.estaTocando());
  }

  function marcarLendo(el) {
    limparMarca();
    if (el) el.classList.add('lendo-agora');
  }
  function limparMarca() {
    var antigo = document.querySelector('.lendo-agora');
    if (antigo) antigo.classList.remove('lendo-agora');
  }

  function cancelarAgendamento() {
    if (temporizador) { clearTimeout(temporizador); temporizador = null; }
    ultimoAlvo = null;
    limparMarca();
  }

  function falarElemento(el) {
    temporizador = null;
    if (!ligada || !el.isConnected) return;
    if (outroAudioTocando()) return;      // a explicação da organela tem prioridade

    var frase = frasePara(el);
    if (!frase) return;

    marcarLendo(el);
    if (typeof window.falar === 'function') window.falar(frase);
  }

  function agendar(no) {
    if (!ligada) return;
    var el = (no && no.closest) ? no.closest(SELETOR) : null;

    if (!el) { cancelarAgendamento(); return; }
    if (el === ultimoAlvo) return;        // já está lendo/leu este mesmo

    if (temporizador) clearTimeout(temporizador);
    limparMarca();
    ultimoAlvo = el;
    temporizador = setTimeout(function () { falarElemento(el); }, ATRASO);
  }

  /* ---------------------------------------------------------------------
     Eventos (registrados uma vez; ficam inertes enquanto estiver desligado)
     --------------------------------------------------------------------- */

  document.addEventListener('pointerover', function (e) {
    if (!ligada) return;
    if (e.pointerType === 'touch') return;   // no celular o dedo já clica
    agendar(e.target);
  });

  document.addEventListener('pointerout', function (e) {
    if (!ligada) return;
    if (e.pointerType === 'touch') return;
    var indo = e.relatedTarget;
    // Só cancela quando o ponteiro realmente saiu do elemento atual.
    if (ultimoAlvo && indo && ultimoAlvo.contains(indo)) return;
    cancelarAgendamento();
  });

  // Teclado: quem navega por Tab também precisa ouvir.
  document.addEventListener('focusin', function (e) {
    if (!ligada) return;
    agendar(e.target);
  });
  document.addEventListener('focusout', function () {
    if (!ligada) return;
    cancelarAgendamento();
  });

  // Esc silencia na hora — saída de emergência sempre disponível.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      cancelarAgendamento();
      if (typeof window.pararFala === 'function') window.pararFala();
    }
  });

  window.addEventListener('pagehide', function () { cancelarAgendamento(); });

  /* ---------------------------------------------------------------------
     API pública
     --------------------------------------------------------------------- */
  window.LeituraAoPassar = {
    // Compartilhado com a barra de acessibilidade ("Ler esta página"),
    // para que os enfeites sejam removidos com a mesma regra em todo lugar.
    limparTexto: limpar,
    ligar: function () { ligada = true; },
    desligar: function () {
      ligada = false;
      cancelarAgendamento();
      if (typeof window.pararFala === 'function') window.pararFala();
    },
    estaLigada: function () { return ligada; }
  };
})();
