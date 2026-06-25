/* =========================================================================
   EXPLORADOR DA CÉLULA  (main.js — página inicial)
   -------------------------------------------------------------------------
   - Mostra o mascote "Célu" e o painel "Sua jornada" (progresso + medalhas).
   - Alterna entre Célula Animal e Célula Vegetal.
   - Mostra um DIAGRAMA com as organelas como pontos clicáveis (mapa de pontos).
   - Mostra também uma LISTA de texto, que é a alternativa acessível e
     funciona muito bem com leitor de tela e para quem prefere lista.
   Tudo é montado a partir de data/organelas.js.
   ========================================================================= */

(function () {
  var diagrama = document.getElementById('diagrama');
  var lista = document.getElementById('lista-organelas');
  var titulo = document.getElementById('titulo-secao');
  var botoes = document.querySelectorAll('.card-celula');
  if (!lista) return; // não é a home

  var CHAVE = 'celulas_tipo';

  /* ---- Mascote no topo ---- */
  var caixaMascote = document.getElementById('mascote-hero');
  if (caixaMascote && window.svgMascote) {
    caixaMascote.innerHTML = window.svgMascote({ size: 140 });
  }

  function nomeCelula(tipo) {
    return tipo === 'animal' ? 'Célula Animal' : 'Célula Vegetal';
  }

  function iconeOrg(o, classe) {
    if (window.svgIconeOrganela) return window.svgIconeOrganela(o.id, { cls: classe });
    return '<span aria-hidden="true">' + (o.emoji || '•') + '</span>';
  }

  function montarDiagrama(tipo, organelas) {
    if (!diagrama) return;
    diagrama.className = 'diagrama ' + tipo;
    diagrama.innerHTML =
      '<div class="celula-forma" aria-hidden="true">' +
        (tipo === 'vegetal' ? '<span class="rotulo-forma">Parede e membrana</span>' : '<span class="rotulo-forma">Membrana</span>') +
      '</div>';

    organelas.forEach(function (o) {
      var visitado = window.Progresso && window.Progresso.visitou(o.id);
      var a = document.createElement('a');
      a.className = 'hotspot' + (visitado ? ' visitado' : '');
      a.href = 'organela.html?id=' + o.id + '&celula=' + tipo;
      a.style.left = o.mapa.x + '%';
      a.style.top = o.mapa.y + '%';
      a.setAttribute('aria-label', o.nome + ': ' + o.apelido + (visitado ? ' (já explorada)' : ''));
      a.innerHTML =
        '<span class="ponto" style="--cor:' + o.cor + '">' + iconeOrg(o) + '</span>' +
        '<span class="ponto-rotulo">' + o.nome + '</span>';
      diagrama.appendChild(a);
    });
  }

  function montarLista(tipo, organelas) {
    lista.innerHTML = '';
    organelas.forEach(function (o) {
      var visitado = window.Progresso && window.Progresso.visitou(o.id);
      var a = document.createElement('a');
      a.className = 'card-organela';
      a.href = 'organela.html?id=' + o.id + '&celula=' + tipo;

      if (visitado) {
        var selo = document.createElement('span');
        selo.className = 'selo-explorado';
        selo.innerHTML = (window.svgUI ? window.svgUI('check') : '✓') + ' explorada';
        a.appendChild(selo);
      }

      var fig = document.createElement('div');
      fig.className = 'mini-img org-capa';
      fig.style.setProperty('--cor', o.cor);
      fig.setAttribute('role', 'img');
      fig.setAttribute('aria-label', 'Ilustração de ' + o.nome);
      fig.innerHTML = iconeOrg(o);
      // Se houver foto, ela substitui a capa ilustrada.
      var img = new Image();
      img.onload = function () {
        fig.classList.remove('org-capa');
        fig.innerHTML = '';
        fig.style.backgroundImage = 'url("' + o.img + '")';
        fig.style.backgroundSize = 'cover';
        fig.style.backgroundPosition = 'center';
      };
      img.src = o.img;
      a.appendChild(fig);

      var h3 = document.createElement('h3');
      h3.innerHTML = o.nome + ' <small class="apelido">— ' + o.apelido + '</small>';
      a.appendChild(h3);

      var p = document.createElement('p');
      p.textContent = o.resumo;
      a.appendChild(p);

      lista.appendChild(a);
    });
  }

  /* ---- Painel "Sua jornada": barra de progresso + medalhas ---- */
  function montarJornada() {
    var caixa = document.getElementById('jornada');
    if (!caixa || !window.Progresso) return;
    var t = window.Progresso.totais();
    var pct = t.total ? Math.round((t.visitadas / t.total) * 100) : 0;
    var meds = window.Progresso.medalhas();
    var conquistadas = meds.filter(function (m) { return m.conquistada; }).length;

    var html =
      '<h2>' + (window.svgUI ? window.svgUI('bussola') : '') + ' Sua jornada</h2>' +
      '<p class="jornada-sub">Você já explorou <span class="jornada-num">' + t.visitadas +
        ' de ' + t.total + '</span> organelas e conquistou <span class="jornada-num">' +
        conquistadas + ' de ' + meds.length + '</span> medalhas. Continue!</p>' +
      '<div class="jornada-barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + t.total +
        '" aria-valuenow="' + t.visitadas + '" aria-label="Organelas exploradas">' +
        '<span style="width:' + pct + '%"></span></div>' +
      '<div class="medalhas">';

    meds.forEach(function (m) {
      var glifo = window.svgUI ? window.svgUI(m.icone) : '★';
      var cad = window.svgUI ? window.svgUI('cadeado') : '🔒';
      if (m.conquistada) {
        html +=
          '<div class="medalha conquistada">' +
            '<div class="medalha-disco" style="background:' + m.cor + '">' + glifo + '</div>' +
            '<div class="medalha-nome">' + m.nome + '</div>' +
            '<div class="medalha-desc">Conquistada! 🎉</div>' +
          '</div>';
      } else {
        var falta = m.falta > 0 ? ('Faltam ' + m.falta) : 'Quase lá';
        html +=
          '<div class="medalha bloqueada">' +
            '<div class="medalha-disco">' + glifo +
              '<span class="medalha-cadeado">' + cad + '</span>' +
            '</div>' +
            '<div class="medalha-nome">' + m.nome + '</div>' +
            '<div class="medalha-desc">' + m.desc + ' (' + falta + ')</div>' +
          '</div>';
      }
    });
    html += '</div>';
    caixa.innerHTML = html;
  }

  function mostrar(tipo) {
    botoes.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.tipo === tipo ? 'true' : 'false');
    });
    var organelas = window.organelasPorCelula(tipo);
    if (titulo) {
      titulo.innerHTML =
        '<h2>Organelas da ' + nomeCelula(tipo) + '</h2>' +
        '<span class="tag">' + organelas.length + ' organelas</span>';
    }
    montarDiagrama(tipo, organelas);
    montarLista(tipo, organelas);
    try { localStorage.setItem(CHAVE, tipo); } catch (e) {}
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () { mostrar(b.dataset.tipo); });
  });

  var inicial = 'animal';
  try { inicial = localStorage.getItem(CHAVE) || 'animal'; } catch (e) {}
  mostrar(inicial);
  montarJornada();

  // Se o progresso mudar (ex.: voltou de uma organela noutra aba), atualiza.
  if (window.Progresso) {
    window.Progresso.aoMudar(function () { mostrar(inicial); montarJornada(); });
  }
})();
