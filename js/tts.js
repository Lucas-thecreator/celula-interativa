/* =========================================================================
   CAMADA DE ÁUDIO  (tts.js)
   -------------------------------------------------------------------------
   Objetivo: deixar o áudio TROCÁVEL. Hoje usamos a voz do navegador
   (Web Speech API / speechSynthesis) em português. Amanhã, se você gravar
   MP3s de melhor qualidade, é só preencher o campo `audio` da organela em
   data/organelas.js — nenhuma página precisa mudar.

   API exposta:
     falar(texto)                  -> lê um texto com a voz pt-BR (atalho simples)
     pararFala()                   -> interrompe qualquer fala/áudio
     AudioFala.configurar(org, cb) -> prepara o player de uma organela
     AudioFala.tocar/pausar/retomar/reiniciar/parar
     AudioFala.suportaTTS          -> boolean

   Acessibilidade: o áudio é SEMPRE disparado por um toque/clique do usuário,
   nunca sozinho. Quem usa leitor de tela já tem a página lida pelo próprio
   leitor; o botão de áudio é um complemento (baixa visão, dislexia, quem
   gosta de ouvir) e não atrapalha o leitor de tela.
   ========================================================================= */

(function () {
  var suportaTTS = ('speechSynthesis' in window);

  // O carregamento das vozes às vezes é assíncrono — pedimos cedo.
  if (suportaTTS) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
      window.speechSynthesis.getVoices();
    };
  }

  function escolherVozPtBr() {
    if (!suportaTTS) return null;
    var vozes = window.speechSynthesis.getVoices();
    return vozes.find(function (v) { return /pt[-_]br/i.test(v.lang); }) ||
           vozes.find(function (v) { return /^pt/i.test(v.lang); }) ||
           null;
  }

  function novaFala(texto) {
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    u.rate = 0.95;   // um tiquinho mais devagar, melhor para crianças
    u.pitch = 1;
    var voz = escolherVozPtBr();
    if (voz) u.voice = voz;
    return u;
  }

  /* Atalho simples pedido no brief: falar(texto). */
  window.falar = function (texto) {
    if (!suportaTTS || !texto) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(novaFala(texto));
  };

  window.pararFala = function () {
    if (suportaTTS) window.speechSynthesis.cancel();
  };

  /* -----------------------------------------------------------------------
     Player completo (usado na página da organela): toca MP3 se existir,
     senão usa a voz do navegador. Avisa o estado por callback para a
     interface mostrar "Tocando / Pausado / Concluído".
     ----------------------------------------------------------------------- */
  var AudioFala = (function () {
    var modo = null;           // 'mp3' ou 'tts'
    var elAudio = null;        // <audio> quando for MP3
    var texto = '';            // texto a falar quando for TTS
    var aoMudarEstado = function () {};

    function configurar(organela, callbackEstado) {
      parar();
      aoMudarEstado = callbackEstado || function () {};
      if (organela.audio) {
        modo = 'mp3';
        elAudio = new Audio(organela.audio);
        elAudio.addEventListener('play',  function () { aoMudarEstado('tocando'); });
        elAudio.addEventListener('pause', function () { aoMudarEstado('pausado'); });
        elAudio.addEventListener('ended', function () { aoMudarEstado('fim'); });
      } else {
        modo = 'tts';
        // O brief pede que o áudio leia a ANALOGIA da organela.
        texto = organela.analogia || organela.resumo || '';
      }
    }

    function tocar() {
      if (modo === 'mp3') return elAudio.play(); // Promise (pode ser bloqueada)
      if (!suportaTTS) { aoMudarEstado('sem-suporte'); return Promise.reject(); }
      window.speechSynthesis.cancel();
      var u = novaFala(texto);
      u.onstart  = function () { aoMudarEstado('tocando'); };
      u.onpause  = function () { aoMudarEstado('pausado'); };
      u.onresume = function () { aoMudarEstado('tocando'); };
      u.onend    = function () { aoMudarEstado('fim'); };
      window.speechSynthesis.speak(u);
      return Promise.resolve();
    }

    function pausar() {
      if (modo === 'mp3' && elAudio) { elAudio.pause(); }
      else if (suportaTTS && window.speechSynthesis.speaking) { window.speechSynthesis.pause(); }
    }
    function retomar() {
      if (modo === 'mp3' && elAudio) { elAudio.play(); }
      else if (suportaTTS && window.speechSynthesis.paused) { window.speechSynthesis.resume(); }
    }
    function reiniciar() { parar(); return tocar(); }
    function parar() {
      if (modo === 'mp3' && elAudio) { elAudio.pause(); elAudio.currentTime = 0; }
      else if (suportaTTS) { window.speechSynthesis.cancel(); }
    }

    return {
      configurar: configurar, tocar: tocar, pausar: pausar,
      retomar: retomar, reiniciar: reiniciar, parar: parar,
      suportaTTS: suportaTTS
    };
  })();

  window.AudioFala = AudioFala;

  // Garante que a fala pare ao sair/trocar de página.
  window.addEventListener('pagehide', function () { try { AudioFala.parar(); } catch (e) {} });
})();
