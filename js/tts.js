/* =========================================================================
   CAMADA DE ÁUDIO  (tts.js)
   -------------------------------------------------------------------------
   Objetivo: deixar o áudio TROCÁVEL. Hoje usamos a voz do navegador
   (Web Speech API / speechSynthesis) em português. Amanhã, se você gravar
   MP3s de melhor qualidade, é só preencher o campo `audio` da organela em
   data/organelas.js — nenhuma página precisa mudar.

   QUALIDADE DA VOZ — leia isto antes de reclamar que "a voz é robótica":
   quem fornece a voz é o APARELHO, não o site. O Windows traz de fábrica as
   vozes antigas "Microsoft Daniel" e "Microsoft Maria", que soam metálicas.
   As vozes boas têm "Natural", "Neural" ou "Online" no nome e aparecem no
   Microsoft Edge, no Chrome do Android e no iPhone. Por isso o site:
     1) ordena as vozes por qualidade e usa a melhor que encontrar;
     2) deixa o professor escolher outra na barra de acessibilidade.

   API exposta:
     falar(texto)                  -> lê um texto com a voz pt-BR (atalho simples)
     pararFala()                   -> interrompe qualquer fala/áudio
     Vozes.listar()                -> vozes em português disponíveis no aparelho
     Vozes.escolhida()             -> a voz que será usada agora
     Vozes.aoCarregar(fn)          -> avisa quando a lista de vozes ficar pronta
     AudioFala.configurar(org, cb) -> prepara o player de uma organela
     AudioFala.tocar/pausar/retomar/reiniciar/parar
     AudioFala.suportaTTS          -> boolean

   Acessibilidade: o áudio é SEMPRE disparado por um toque/clique do usuário,
   nunca sozinho. Quem usa leitor de tela já tem a página lida pelo próprio
   leitor; o botão de áudio é um complemento para quem gosta de ouvir e não
   atrapalha o leitor de tela.
   ========================================================================= */

(function () {
  var suportaTTS = ('speechSynthesis' in window);

  /* Preferências de voz — a barra de acessibilidade escreve aqui.
     velocidade: 0.75 devagar · 0.95 normal · 1.25 rápida
     voz: nome (ou voiceURI) escolhido pelo professor; vazio = automático */
  window.FalaConfig = window.FalaConfig || { velocidade: 0.95, voz: '' };

  /* -----------------------------------------------------------------------
     CATÁLOGO DE VOZES
     A lista chega de forma assíncrona: em muitos navegadores a primeira
     chamada a getVoices() volta vazia e só depois dispara 'voiceschanged'.
     ----------------------------------------------------------------------- */
  var ouvintesVoz = [];

  if (suportaTTS) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', function () {
      ouvintesVoz.forEach(function (fn) { try { fn(); } catch (e) {} });
    });
  }

  function listarVozes() {
    if (!suportaTTS) return [];
    return window.speechSynthesis.getVoices().filter(function (v) {
      return /^pt/i.test(v.lang);
    });
  }

  /* Nota de qualidade. Quanto maior, melhor a voz costuma soar.
     "Natural"/"Neural" são as vozes modernas; "Online" roda no servidor da
     Microsoft/Google e soa bem melhor que as locais antigas. */
  function nota(v) {
    var n = 0;
    var nome = v.name || '';
    if (/natural|neural/i.test(nome)) n += 100;
    if (/online/i.test(nome)) n += 50;
    if (!v.localService) n += 40;
    if (/pt[-_]br/i.test(v.lang)) n += 20;
    if (v['default']) n += 5;
    return n;
  }

  function porQualidade(lista) {
    return lista.slice().sort(function (a, b) { return nota(b) - nota(a); });
  }

  function vozEscolhida() {
    var lista = listarVozes();
    if (!lista.length) return null;

    var preferida = window.FalaConfig.voz;
    if (preferida) {
      var achada = lista.filter(function (v) {
        return v.voiceURI === preferida || v.name === preferida;
      })[0];
      if (achada) return achada;   // se sumiu do aparelho, cai no automático
    }
    return porQualidade(lista)[0];
  }

  window.Vozes = {
    listar: function () { return porQualidade(listarVozes()); },
    escolhida: vozEscolhida,
    aoCarregar: function (fn) {
      ouvintesVoz.push(fn);
      if (listarVozes().length) fn();   // já estava pronta
    }
  };

  /* -----------------------------------------------------------------------
     MOTOR DE FALA
     Fala em PEDAÇOS curtos, não de uma vez só. Motivo: Chrome e Edge cortam
     a fala por volta dos 15 segundos, principalmente nas vozes "Online".
     Quebrando em frases, cada pedaço termina bem antes disso e o próximo
     entra na sequência — o aluno ouve o texto inteiro.
     ----------------------------------------------------------------------- */
  var MAX_PEDACO = 180;   // caracteres

  function partirEmFrases(texto) {
    var frases = String(texto).match(/[^.!?…]+[.!?…]*\s*/g) || [String(texto)];
    var pedacos = [];
    var atual = '';

    frases.forEach(function (f) {
      if (atual && (atual + f).length > MAX_PEDACO) {
        pedacos.push(atual.trim());
        atual = '';
      }
      if (f.length > MAX_PEDACO) {
        // Frase gigante sem ponto: corta no último espaço que couber.
        var resto = f;
        while (resto.length > MAX_PEDACO) {
          var corte = resto.lastIndexOf(' ', MAX_PEDACO);
          if (corte < 40) corte = MAX_PEDACO;
          pedacos.push(resto.slice(0, corte).trim());
          resto = resto.slice(corte);
        }
        atual = resto;
      } else {
        atual += f;
      }
    });

    if (atual.trim()) pedacos.push(atual.trim());
    return pedacos.filter(Boolean);
  }

  var fila = [];
  var chamados = {};
  var falandoAgora = false;
  var pausadoPeloUsuario = false;
  var geracao = 0;          // invalida a fila antiga quando começa uma nova
  var manterVivo = null;

  function novaFala(texto) {
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    u.rate = window.FalaConfig.velocidade || 0.95;
    u.pitch = 1;
    var voz = vozEscolhida();
    if (voz) {
      u.voice = voz;
      if (voz.lang) u.lang = voz.lang;
    }
    return u;
  }

  /* O Chrome às vezes "adormece" a fila de fala. Um resume() periódico a
     mantém andando — mas nunca quando foi o usuário que mandou pausar. */
  function ligarManterVivo() {
    pararManterVivo();
    manterVivo = setInterval(function () {
      if (pausadoPeloUsuario) return;
      if (window.speechSynthesis.speaking) window.speechSynthesis.resume();
    }, 8000);
  }
  function pararManterVivo() {
    if (manterVivo) { clearInterval(manterVivo); manterVivo = null; }
  }

  function falarProximo(g) {
    if (g !== geracao) return;             // uma fala nova assumiu o lugar

    if (!fila.length) {
      falandoAgora = false;
      pararManterVivo();
      if (chamados.fim) chamados.fim();
      return;
    }

    var u = novaFala(fila.shift());
    u.onend = function () { falarProximo(g); };
    u.onerror = function (e) {
      // "interrupted"/"canceled" = alguém mandou parar. Não é falha real.
      var motivo = e && e.error;
      if (motivo === 'interrupted' || motivo === 'canceled') return;
      falarProximo(g);
    };
    window.speechSynthesis.speak(u);
  }

  function falarTexto(texto, callbacks) {
    if (!suportaTTS || !texto) return false;
    pararTudo();
    geracao++;
    chamados = callbacks || {};
    fila = partirEmFrases(texto);
    if (!fila.length) return false;

    /* Marcamos "falando" já aqui, sem esperar o evento onstart do navegador.
       Ele demora (e em alguns navegadores nem vem), e é justamente nessa
       brecha que a leitura por passagem falaria por cima da narração. */
    falandoAgora = true;
    if (chamados.inicio) chamados.inicio();

    ligarManterVivo();
    falarProximo(geracao);
    return true;
  }

  function pararTudo() {
    geracao++;
    fila = [];
    chamados = {};
    falandoAgora = false;
    pausadoPeloUsuario = false;
    pararManterVivo();
    if (suportaTTS) window.speechSynthesis.cancel();
  }

  /* Atalho simples pedido no brief: falar(texto). */
  window.falar = function (texto) {
    return falarTexto(texto);
  };

  window.pararFala = function () { pararTudo(); };

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
    var tocandoAgora = false;

    /* Centraliza o aviso de estado para sabermos, a qualquer momento, se a
       explicação está no ar. A leitura por hover consulta isso para não
       falar por cima da narração da organela. */
    function notificar(estado) {
      tocandoAgora = (estado === 'tocando');
      aoMudarEstado(estado);
    }
    function estaTocando() { return tocandoAgora; }

    function configurar(organela, callbackEstado) {
      parar();
      aoMudarEstado = callbackEstado || function () {};
      if (organela.audio) {
        modo = 'mp3';
        elAudio = new Audio(organela.audio);
        elAudio.addEventListener('play',  function () { notificar('tocando'); });
        elAudio.addEventListener('pause', function () { notificar('pausado'); });
        elAudio.addEventListener('ended', function () { notificar('fim'); });
      } else {
        modo = 'tts';
        // O brief pede que o áudio leia a ANALOGIA da organela.
        texto = organela.analogia || organela.resumo || '';
      }
    }

    function tocar() {
      if (modo === 'mp3') return elAudio.play(); // Promise (pode ser bloqueada)
      if (!suportaTTS) { notificar('sem-suporte'); return Promise.reject(); }
      var ok = falarTexto(texto, {
        inicio: function () { notificar('tocando'); },
        fim:    function () { notificar('fim'); }
      });
      if (!ok) notificar('sem-suporte');
      return Promise.resolve();
    }

    function pausar() {
      if (modo === 'mp3' && elAudio) { elAudio.pause(); return; }
      if (suportaTTS && window.speechSynthesis.speaking) {
        pausadoPeloUsuario = true;
        window.speechSynthesis.pause();
        notificar('pausado');
      }
    }
    function retomar() {
      if (modo === 'mp3' && elAudio) { elAudio.play(); return; }
      if (suportaTTS) {
        pausadoPeloUsuario = false;
        window.speechSynthesis.resume();
        notificar('tocando');
      }
    }
    function reiniciar() { parar(); return tocar(); }
    function parar() {
      tocandoAgora = false;
      if (modo === 'mp3' && elAudio) { elAudio.pause(); elAudio.currentTime = 0; }
      else if (suportaTTS) { pararTudo(); }
    }

    return {
      configurar: configurar, tocar: tocar, pausar: pausar,
      retomar: retomar, reiniciar: reiniciar, parar: parar,
      estaTocando: estaTocando, suportaTTS: suportaTTS
    };
  })();

  window.AudioFala = AudioFala;

  // Garante que a fala pare ao sair/trocar de página.
  window.addEventListener('pagehide', function () { try { AudioFala.parar(); } catch (e) {} });
})();
