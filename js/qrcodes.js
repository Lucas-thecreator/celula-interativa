/* =========================================================================
   GERADOR DE QR CODES  (qrcodes.js)
   -------------------------------------------------------------------------
   Gera um QR Code para cada organela (e para a home, o quiz e o tutorial),
   prontos para imprimir e colar no verso dos cartões do protótipo.

   A URL base é configurável: depois de publicar o site, cole o endereço no
   campo e clique em "Gerar". Os QR Codes são montados no navegador (lib via
   CDN), então funciona em qualquer hospedagem, sem precisar rebuildar nada.
   ========================================================================= */

(function () {
  var BASE_KEY = 'celulas_qr_base';
  // URL padrão do site publicado (troque aqui se você mudar de endereço).
  var URL_PADRAO = 'https://lucas-thecreator.github.io/celula-interativa/';
  var campoBase = document.getElementById('base');
  var grade = document.getElementById('grade-qr');
  var erroLib = document.getElementById('erro-lib');
  if (!grade) return;

  function itensParaQr() {
    var itens = [
      { nome: '🏠 Página inicial', rota: 'index.html' },
      { nome: '🧪 Quiz da Célula', rota: 'quiz.html' },
      { nome: '🧩 Tutorial (Como montar)', rota: 'tutorial.html' }
    ];
    window.ORGANELAS.forEach(function (o) {
      itens.push({ nome: o.emoji + ' ' + o.nome, rota: 'organela.html?id=' + o.id });
    });
    return itens;
  }

  function urlCompleta(base, rota) {
    if (!base) return rota; // testes locais
    try { return new URL(rota, base.replace(/\/?$/, '/')).href; }
    catch (e) { return base.replace(/\/?$/, '/') + rota; }
  }

  function gerar() {
    grade.innerHTML = '';
    if (typeof QRCode === 'undefined') {
      if (erroLib) erroLib.style.display = 'block';
      return;
    }
    if (erroLib) erroLib.style.display = 'none';

    var base = campoBase ? campoBase.value.trim() : '';
    try { localStorage.setItem(BASE_KEY, base); } catch (e) {}

    itensParaQr().forEach(function (item) {
      var url = urlCompleta(base, item.rota);
      var card = document.createElement('div');
      card.className = 'cartao-qr';
      var h3 = document.createElement('h3'); h3.textContent = item.nome; card.appendChild(h3);
      var box = document.createElement('div'); box.className = 'qr-box'; card.appendChild(box);
      var u = document.createElement('div'); u.className = 'url'; u.textContent = url; card.appendChild(u);
      grade.appendChild(card);
      new QRCode(box, { text: url, width: 190, height: 190, correctLevel: QRCode.CorrectLevel.M });
    });
  }

  var btnGerar = document.getElementById('btn-gerar');
  var btnImprimir = document.getElementById('btn-imprimir');
  if (btnGerar) btnGerar.addEventListener('click', gerar);
  if (btnImprimir) btnImprimir.addEventListener('click', function () { window.print(); });

  try {
    var salvo = localStorage.getItem(BASE_KEY);
    if (campoBase) campoBase.value = (salvo !== null && salvo !== '') ? salvo : URL_PADRAO;
  } catch (e) { if (campoBase && !campoBase.value) campoBase.value = URL_PADRAO; }

  window.addEventListener('load', gerar);
})();
