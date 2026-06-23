/* =========================================================================
   COMUM  (comum.js)  — carregado em todas as páginas
   -------------------------------------------------------------------------
   - Registra o Service Worker (funcionamento offline / instalar como app).
   - Marca o link de navegação da página atual (aria-current="page").
   ========================================================================= */

(function () {
  // 1) Service Worker — só funciona via http(s), não via file://
  if ('serviceWorker' in navigator &&
      (location.protocol === 'http:' || location.protocol === 'https:')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline opcional */ });
    });
  }

  // 2) Destaca o link da página atual no menu
  document.addEventListener('DOMContentLoaded', function () {
    var atual = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === atual) a.setAttribute('aria-current', 'page');
    });
  });
})();
