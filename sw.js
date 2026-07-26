/* =========================================================================
   SERVICE WORKER  (sw.js)  — funcionamento offline / instalável (PWA)
   -------------------------------------------------------------------------
   Estratégia escolhida para EVITAR "site desatualizado":
   - Arquivos do próprio site (páginas, css, js, dados): REDE primeiro. Assim,
     com internet, o aluno SEMPRE vê a versão mais nova; o cache é só reserva
     para quando estiver offline.
   - Recursos externos (Google Fonts, lib de QR): cache primeiro (mudam pouco).

   Ao publicar uma nova versão do site, aumente o número em CACHE (v2 -> v3...)
   para garantir a limpeza do cache antigo nos aparelhos.
   ========================================================================= */

var CACHE = 'celula-interativa-v7';

var CORE = [
  'index.html',
  'organela.html',
  'quiz.html',
  'comparar.html',
  'qrcodes.html',
  'tutorial.html',
  'sobre.html',
  '404.html',
  'css/style.css',
  'data/organelas.js',
  'js/icones.js',
  'js/progresso.js',
  'js/a11y.js',
  'js/comum.js',
  'js/tts.js',
  'js/ler-ao-passar.js',
  'js/main.js',
  'js/organela.js',
  'js/quiz.js',
  'js/comparar.js',
  'js/qrcodes.js',
  'manifest.webmanifest',
  'assets/icon.svg'
];

/* As fotos do protótipo. Ficam separadas do CORE de propósito: o cache.addAll
   é "tudo ou nada", então uma única foto faltando quebraria a instalação
   inteira do modo offline — e em silêncio. Aqui cada uma é guardada por
   conta própria; quem faltar simplesmente não fica disponível offline. */
var FOTOS = [
  'img/membrana-plasmatica.jpg',
  'img/nucleo.jpg',
  'img/mitocondria.jpg',
  'img/citoplasma.jpg',
  'img/ribossomo.jpg',
  'img/reticulo-endoplasmatico.jpg',
  'img/complexo-de-golgi.jpg',
  'img/centriolos.jpg',
  'img/vacuolo.jpg',
  'img/cloroplasto.jpg',
  'img/parede-celular.jpg',

  // Passo a passo da montagem (tutorial.html)
  'img/tutorial-1-base-isopor.jpg',
  'img/tutorial-2-tnt-branco.jpg',
  'img/tutorial-3-parede-celular.jpg',
  'img/tutorial-4-citoplasma.jpg',
  'img/tutorial-5-contornos.jpg',
  'img/tutorial-6-organelas.jpg',
  'img/tutorial-7-velcro.jpg',
  'img/tutorial-8-vegetal.jpg',
  'img/tutorial-9-animal.jpg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(CORE).then(function () {
        return Promise.all(FOTOS.map(function (u) {
          return cache.add(u).catch(function () { /* foto ainda não enviada */ });
        }));
      });
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

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  var mesmaOrigem = (url.origin === self.location.origin);

  // Páginas e arquivos do próprio site: REDE primeiro, cache como reserva.
  if (req.mode === 'navigate' || mesmaOrigem) {
    e.respondWith(
      fetch(req).then(function (resp) {
        if (resp && resp.status === 200) {
          var copia = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copia); });
        }
        return resp;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          if (r) return r;
          return (req.mode === 'navigate') ? caches.match('index.html') : Response.error();
        });
      })
    );
    return;
  }

  // Recursos externos (fontes, lib de QR): cache primeiro.
  e.respondWith(
    caches.match(req).then(function (cacheado) {
      return cacheado || fetch(req).then(function (resp) {
        if (resp && resp.status === 200 && (resp.type === 'basic' || resp.type === 'cors')) {
          var copia = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copia); });
        }
        return resp;
      }).catch(function () { return cacheado; });
    })
  );
});
