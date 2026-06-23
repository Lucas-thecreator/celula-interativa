/* =========================================================================
   CONTROLES DE ACESSIBILIDADE  (a11y.js)
   -------------------------------------------------------------------------
   Monta a barra fixa em qualquer página que tenha <div id="a11y-bar">:
     A−  / A+        -> diminui / aumenta o tamanho do texto
     Alto contraste  -> liga/desliga tema preto-e-amarelo
     Modo escuro     -> liga/desliga (opcional)
   Tudo é salvo em localStorage e reaplicado nas próximas visitas.

   Importante: estes controles COMPLEMENTAM o leitor de tela, não o
   substituem. Os botões têm rótulo de texto (nunca só ícone) e estado
   aria-pressed para o leitor anunciar ligado/desligado.
   ========================================================================= */

(function () {
  var CHAVE = 'celulas_a11y';
  var FONTE_MIN = 0.85, FONTE_MAX = 1.9, PASSO = 0.15;

  function lerPrefs() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { return {}; }
  }
  function salvarPrefs(p) {
    try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) {}
  }

  function aplicarPrefs(p) {
    document.documentElement.style.setProperty('--font-scale', p.fonte || 1);
    document.documentElement.classList.toggle('hc', !!p.contraste);
    document.documentElement.classList.toggle('escuro', !!p.escuro);
    marcar('btn-contraste', !!p.contraste);
    marcar('btn-escuro', !!p.escuro);
  }
  function marcar(id, ligado) {
    var b = document.getElementById(id);
    if (b) b.setAttribute('aria-pressed', ligado ? 'true' : 'false');
  }

  function montar() {
    var bar = document.getElementById('a11y-bar');
    if (!bar) return;
    bar.innerHTML =
      '<div class="conteiner" role="group" aria-label="Controles de acessibilidade">' +
        '<span class="rotulo">♿ Acessibilidade:</span>' +
        '<button class="btn-a11y" id="btn-fonte-menos" aria-label="Diminuir o tamanho do texto">A−</button>' +
        '<button class="btn-a11y" id="btn-fonte-mais" aria-label="Aumentar o tamanho do texto">A+</button>' +
        '<button class="btn-a11y" id="btn-contraste" aria-pressed="false">Alto contraste</button>' +
        '<button class="btn-a11y" id="btn-escuro" aria-pressed="false">Modo escuro</button>' +
      '</div>';

    var prefs = lerPrefs();

    document.getElementById('btn-fonte-mais').addEventListener('click', function () {
      prefs.fonte = Math.min((prefs.fonte || 1) + PASSO, FONTE_MAX);
      salvarPrefs(prefs); aplicarPrefs(prefs);
    });
    document.getElementById('btn-fonte-menos').addEventListener('click', function () {
      prefs.fonte = Math.max((prefs.fonte || 1) - PASSO, FONTE_MIN);
      salvarPrefs(prefs); aplicarPrefs(prefs);
    });
    document.getElementById('btn-contraste').addEventListener('click', function () {
      prefs.contraste = !prefs.contraste;
      if (prefs.contraste) prefs.escuro = false; // não faz sentido os dois juntos
      salvarPrefs(prefs); aplicarPrefs(prefs);
    });
    document.getElementById('btn-escuro').addEventListener('click', function () {
      prefs.escuro = !prefs.escuro;
      if (prefs.escuro) prefs.contraste = false;
      salvarPrefs(prefs); aplicarPrefs(prefs);
    });

    aplicarPrefs(prefs);
  }

  // Aplica as preferências o quanto antes para evitar "piscar" sem o tema.
  aplicarPrefs(lerPrefs());
  document.addEventListener('DOMContentLoaded', montar);
})();
