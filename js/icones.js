/* =========================================================================
   ÍCONES E MASCOTE  (icones.js)  — biblioteca de SVGs do site
   -------------------------------------------------------------------------
   Por que SVG e não emoji? Emoji muda de desenho em cada celular/sistema,
   não dá para colorir e fica borrado quando aumenta. Estes ícones são
   vetoriais: sempre iguais, nítidos em qualquer tamanho e coloridos pela
   cor da própria organela (usam "currentColor").

   Tudo aqui é só TEXTO (strings de SVG), carregado por <script> comum, então
   funciona até abrindo o site direto do arquivo (file://), sem servidor.

   API exposta:
     window.svgIconeOrganela(id, { size, cls })  -> <svg> da organela
     window.svgUI(nome, { size, cls })            -> <svg> de interface
     window.svgMascote({ size, fala })            -> o mascote "Célu"
   ========================================================================= */

(function () {
  /* ---------------------------------------------------------------------
     GLIFOS DAS ORGANELAS — desenhos simples, cheios (sem traços finos que
     somem em telas pequenas), todos no mesmo "idioma visual": formas
     arredondadas, em uma cor só (currentColor = cor da organela).
     viewBox 0 0 64 64.
     --------------------------------------------------------------------- */
  var ORG = {
    /* Portão / membrana: um arco de entrada com uma "molécula" passando. */
    'membrana-plasmatica':
      '<path fill-rule="evenodd" d="M14 54V30a18 18 0 0 1 36 0v24h-9V30a9 9 0 0 0-18 0v24z"/>' +
      '<circle cx="32" cy="40" r="5.2"/>',

    /* Núcleo: anel (membrana nuclear) com o nucléolo no centro. */
    'nucleo':
      '<path fill-rule="evenodd" d="M32 9a23 23 0 1 0 0 46 23 23 0 0 0 0-46zm0 9a14 14 0 1 1 0 28 14 14 0 0 1 0-28z"/>' +
      '<circle cx="32" cy="32" r="6.5"/>',

    /* Mitocôndria: formato de "feijão" com um raio (energia) recortado. */
    'mitocondria':
      '<path fill-rule="evenodd" d="M20 16h24a14 14 0 0 1 0 32H20a14 14 0 0 1 0-32zm15 7-12 13h7l-2 9 12-13h-7z"/>',

    /* Citoplasma: bolha de gel com pequenas "bolhas" dentro. */
    'citoplasma':
      '<path fill-rule="evenodd" d="M32 8c14 0 24 9 24 24S46 56 32 56 8 47 8 32 18 8 32 8zm-7 14a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm15 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-4 13a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>',

    /* Ribossomo: duas subunidades (uma grande e uma pequena). */
    'ribossomo':
      '<circle cx="32" cy="40" r="15"/>' +
      '<ellipse cx="32" cy="20" rx="13" ry="8"/>',

    /* Retículo endoplasmático: membrana dobrada (fita em zigue-zague). */
    'reticulo-endoplasmatico':
      '<path d="M10 16h44v7H22a3 3 0 0 0 0 6h32v7H22a10 10 0 0 1 0-20z"/>' +
      '<path d="M54 35v7H22a3 3 0 0 0 0 6h32v7H22a10 10 0 0 1 0-20z" opacity=".62"/>',

    /* Complexo de Golgi: pilha de "sacos" (cisternas) empilhados. */
    'complexo-de-golgi':
      '<path d="M14 14h36a8 8 0 0 1 0 16H14a8 8 0 0 1 0-16z"/>' +
      '<path d="M18 32h28a7 7 0 0 1 0 14H18a7 7 0 0 1 0-14z" opacity=".78"/>' +
      '<path d="M23 47h18a6 6 0 0 1 0 12H23a6 6 0 0 1 0-12z" opacity=".58"/>',

    /* Centríolos: par de cilindros perpendiculares. */
    'centriolos':
      '<rect x="12" y="24" width="34" height="16" rx="8"/>' +
      '<rect x="24" y="12" width="16" height="34" rx="8" opacity=".7"/>',

    /* Vacúolo: gota de água (armazena água). */
    'vacuolo':
      '<path d="M32 7c9 14 16 21 16 30a16 16 0 0 1-32 0c0-9 7-16 16-30z"/>',

    /* Cloroplasto: folha (fotossíntese). */
    'cloroplasto':
      '<path d="M50 12C26 12 13 26 13 49c0 1 .3 2 .5 3 16-2 38-12 38-40z"/>' +
      '<path d="M14 52C24 38 34 31 46 26" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>',

    /* Parede celular: muro de tijolos. */
    'parede-celular':
      '<rect x="9" y="14" width="20" height="10" rx="2.5"/>' +
      '<rect x="33" y="14" width="22" height="10" rx="2.5"/>' +
      '<rect x="9" y="27" width="13" height="10" rx="2.5"/>' +
      '<rect x="26" y="27" width="29" height="10" rx="2.5"/>' +
      '<rect x="9" y="40" width="22" height="10" rx="2.5"/>' +
      '<rect x="35" y="40" width="20" height="10" rx="2.5"/>',

    /* fallback */
    '_padrao': '<circle cx="32" cy="32" r="20"/>'
  };

  /* ---------------------------------------------------------------------
     ÍCONES DE INTERFACE — usados em botões, medalhas e seções.
     --------------------------------------------------------------------- */
  var UI = {
    estrela:
      '<path d="M32 6l7.6 15.4L56 23.8 44 35.6l2.8 16.6L32 44.4 17.2 52.2 20 35.6 8 23.8l16.4-2.4z"/>',
    foguete:
      '<path d="M32 6c8 6 12 14 12 24l-4 10H24l-4-10C20 20 24 12 32 6zm0 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>' +
      '<path d="M20 44l-6 8 10-2zm24 0l6 8-10-2z" opacity=".7"/>',
    lupa:
      '<path fill-rule="evenodd" d="M28 8a20 20 0 1 1-12.7 35.4L8 50.7 13.3 56l7.3-7.3A20 20 0 0 1 28 8zm0 8a12 12 0 1 0 0 24 12 12 0 0 0 0-24z"/>',
    trofeu:
      '<path d="M18 10h28v8a14 14 0 0 1-28 0z"/>' +
      '<path d="M14 12H8v4a10 10 0 0 0 10 10v-6a4 4 0 0 1-4-4zm36 0h6v4a10 10 0 0 1-10 10v-6a4 4 0 0 0 4-4z"/>' +
      '<rect x="28" y="30" width="8" height="10"/>' +
      '<rect x="18" y="40" width="28" height="9" rx="3"/>',
    medalha:
      '<path d="M22 6h8l-5 18-8-10zm12 0h8l-5 8-8 10z" opacity=".75"/>' +
      '<circle cx="32" cy="40" r="17"/>' +
      '<path fill="#ffffff" opacity=".85" d="M32 30l3.2 6.5 7.2 1-5.2 5.1 1.2 7.1L32 46.4l-6.4 3.3 1.2-7.1-5.2-5.1 7.2-1z"/>',
    cadeado:
      '<path fill-rule="evenodd" d="M20 28v-4a12 12 0 0 1 24 0v4h3a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4zm6 0h12v-4a6 6 0 0 0-12 0z"/>',
    check:
      '<path d="M52 16L26 44 12 30l-5 5 19 19 31-33z"/>',
    coracao:
      '<path d="M32 54S8 40 8 23a13 13 0 0 1 24-7 13 13 0 0 1 24 7c0 17-24 31-24 31z"/>',
    som:
      '<path d="M10 24h10l14-12v40L20 40H10z"/>' +
      '<path d="M42 22a14 14 0 0 1 0 20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    bussola:
      '<path fill-rule="evenodd" d="M32 6a26 26 0 1 0 0 52 26 26 0 0 0 0-52zm0 8a18 18 0 1 1 0 36 18 18 0 0 1 0-36z"/>' +
      '<path d="M42 22 28 28l-6 14 14-6z" fill="#ffffff" opacity=".9"/>'
  };

  function montar(glyph, opts) {
    opts = opts || {};
    var size = opts.size || 64;
    var cls = 'ico' + (opts.cls ? ' ' + opts.cls : '');
    return (
      '<svg class="' + cls + '" viewBox="0 0 64 64" width="' + size + '" height="' + size +
      '" fill="currentColor" aria-hidden="true" focusable="false">' + glyph + '</svg>'
    );
  }

  window.svgIconeOrganela = function (id, opts) {
    return montar(ORG[id] || ORG._padrao, opts);
  };
  window.svgUI = function (nome, opts) {
    return montar(UI[nome] || UI.estrela, opts);
  };
  window.ICONES_ORG = ORG;
  window.ICONES_UI = UI;

  /* ---------------------------------------------------------------------
     MASCOTE "Célu" — uma célula simpática que guia a criança.
     É um desenho (várias cores), então não usa currentColor.
     `fala` (opcional) vira o <title> acessível do SVG.
     --------------------------------------------------------------------- */
  window.svgMascote = function (opts) {
    opts = opts || {};
    var size = opts.size || 132;
    var titulo = opts.fala
      ? '<title>' + opts.fala + '</title>'
      : '';
    var role = opts.fala ? ' role="img"' : ' aria-hidden="true"';
    return (
      '<svg class="mascote-svg" viewBox="0 0 132 138" width="' + size + '" height="' + Math.round(size * 138 / 132) +
      '"' + role + ' focusable="false">' + titulo +
      /* flagelo (rabinho) */
      '<path d="M66 120c-6 8-2 16 6 16" fill="none" stroke="#1E3A8A" stroke-width="5" stroke-linecap="round"/>' +
      /* bracinhos */
      '<path d="M20 78c-9 2-14 8-14 16" fill="none" stroke="#1E3A8A" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M112 78c9 2 14 8 14 16" fill="none" stroke="#1E3A8A" stroke-width="6" stroke-linecap="round"/>' +
      /* corpo (membrana) */
      '<ellipse cx="66" cy="64" rx="56" ry="54" fill="#BFE3FF" stroke="#2563EB" stroke-width="6"/>' +
      /* núcleo (barriguinha) */
      '<circle cx="66" cy="74" r="20" fill="#93C5FD"/>' +
      '<circle cx="66" cy="74" r="8" fill="#3B82F6"/>' +
      /* bochechas */
      '<ellipse cx="38" cy="66" rx="9" ry="6" fill="#FCA5A5"/>' +
      '<ellipse cx="94" cy="66" rx="9" ry="6" fill="#FCA5A5"/>' +
      /* olhos */
      '<circle cx="50" cy="52" r="9" fill="#fff"/>' +
      '<circle cx="82" cy="52" r="9" fill="#fff"/>' +
      '<circle cx="52" cy="54" r="4.6" fill="#1E3A8A"/>' +
      '<circle cx="80" cy="54" r="4.6" fill="#1E3A8A"/>' +
      '<circle cx="53.6" cy="52.4" r="1.6" fill="#fff"/>' +
      '<circle cx="81.6" cy="52.4" r="1.6" fill="#fff"/>' +
      /* sorriso */
      '<path d="M54 64a13 13 0 0 0 24 0" fill="none" stroke="#1E3A8A" stroke-width="4.5" stroke-linecap="round"/>' +
      /* organelinhas flutuando */
      '<circle cx="40" cy="36" r="5" fill="#F97316"/>' +
      '<circle cx="92" cy="38" r="4" fill="#16A34A"/>' +
      '</svg>'
    );
  };
})();
