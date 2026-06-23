/* =========================================================================
   EXPLORADOR DA CÉLULA  (main.js — página inicial)
   -------------------------------------------------------------------------
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

  function nomeCelula(tipo) {
    return tipo === 'animal' ? 'Célula Animal' : 'Célula Vegetal';
  }

  function montarDiagrama(tipo, organelas) {
    if (!diagrama) return;
    diagrama.className = 'diagrama ' + tipo;
    diagrama.innerHTML =
      '<div class="celula-forma" aria-hidden="true">' +
        (tipo === 'vegetal' ? '<span class="rotulo-forma">Parede e membrana</span>' : '<span class="rotulo-forma">Membrana</span>') +
      '</div>';

    organelas.forEach(function (o) {
      var a = document.createElement('a');
      a.className = 'hotspot';
      a.href = 'organela.html?id=' + o.id + '&celula=' + tipo;
      a.style.left = o.mapa.x + '%';
      a.style.top = o.mapa.y + '%';
      a.setAttribute('aria-label', o.nome + ': ' + o.apelido);
      a.innerHTML =
        '<span class="ponto" style="--cor:' + o.cor + '" aria-hidden="true">' + o.emoji + '</span>' +
        '<span class="ponto-rotulo">' + o.nome + '</span>';
      diagrama.appendChild(a);
    });
  }

  function montarLista(tipo, organelas) {
    lista.innerHTML = '';
    organelas.forEach(function (o) {
      var a = document.createElement('a');
      a.className = 'card-organela';
      a.href = 'organela.html?id=' + o.id + '&celula=' + tipo;

      var fig = document.createElement('div');
      fig.className = 'mini-img placeholder-img';
      fig.setAttribute('role', 'img');
      fig.setAttribute('aria-label', 'Imagem de ' + o.nome);
      fig.innerHTML = '<span class="mini-emoji" aria-hidden="true">' + o.emoji + '</span>';
      // Se houver foto, ela substitui o placeholder.
      var img = new Image();
      img.onload = function () {
        fig.classList.remove('placeholder-img');
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
})();
