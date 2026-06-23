/* =========================================================================
   SERVICE WORKER  (sw.js)  — funcionamento offline / instalável (PWA)
   -------------------------------------------------------------------------
   Estratégia:
   - Na instalação, guarda os arquivos principais do site (app shell).
   - Páginas (navegação): tenta a rede primeiro e cai para o cache se offline
     — assim o conteúdo atualiza quando há internet.
   - Demais arquivos (css, js, imagens, fontes): usa o cache primeiro e busca
     na rede só se não tiver — rápido e funciona offline.

   Ao publicar uma nova versão do site, aumente o número em CACHE para forçar
   a atualização nos aparelhos.
   ========================================================================= */

var CACHE = 'celula-interativa-v1';

var CORE = [
  'index.html',
  'organela.html',
  'quiz.html',
  'qrcodes.html',
  'tutorial.html',
  'sobre.html',
  'css/style.css',
  'data/organelas.js',
  'js/a11y.js',
  'js/comum.js',
  'js/tts.js',
  'js/main.js',
  'js/organela.js',
  'js/quiz.js',
  'js/qrcodes.js',
  'manifest.webmanifest',
  'assets/icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(CORE);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(chaves.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  // Páginas: rede primeiro, cache como reserva (ignora a query ?id=...).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (resp) {
        var copia = resp.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copia); });
        return resp;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          return r || caches.match('index.html');
        });
      })
    );
    return;
  }

  // Outros arquivos: cache primeiro, depois rede (guardando para a próxima).
  e.respondWith(
    caches.match(req).then(function (cacheado) {
      if (cacheado) return cacheado;
      return fetch(req).then(function (resp) {
        if (resp && resp.status === 200 &&
            (resp.type === 'basic' || resp.type === 'cors')) {
          var copia = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copia); });
        }
        return resp;
      }).catch(function () { return cacheado; });
    })
  );
});
