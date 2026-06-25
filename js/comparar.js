/* =========================================================================
   COMPARAR ANIMAL × VEGETAL  (comparar.js)
   -------------------------------------------------------------------------
   Monta, a partir de data/organelas.js, três grupos:
     - As duas têm   (organelas com celulas = ['animal','vegetal'])
     - Só na animal  (celulas = ['animal'])
     - Só na vegetal (celulas = ['vegetal'])
   e um placar com o total de organelas de cada célula. Cada item leva para
   a página da organela. Nada de cor sozinha: cada item tem texto/etiqueta.
   ========================================================================= */

(function () {
  var alvo = document.getElementById('comparar');
  if (!alvo) return;

  var todas = window.ORGANELAS || [];
  function temAnimal(o) { return o.celulas.indexOf('animal') !== -1; }
  function temVegetal(o) { return o.celulas.indexOf('vegetal') !== -1; }

  var ambas = todas.filter(function (o) { return temAnimal(o) && temVegetal(o); });
  var soAnimal = todas.filter(function (o) { return temAnimal(o) && !temVegetal(o); });
  var soVegetal = todas.filter(function (o) { return temVegetal(o) && !temAnimal(o); });

  var totalAnimal = ambas.length + soAnimal.length;
  var totalVegetal = ambas.length + soVegetal.length;

  function icone(o) {
    return window.svgIconeOrganela ? window.svgIconeOrganela(o.id) : '';
  }

  function marcas(o) {
    var m = '';
    if (temAnimal(o)) m += '<span class="marca animal">Animal</span>';
    if (temVegetal(o)) m += '<span class="marca vegetal">Vegetal</span>';
    return m;
  }

  function linha(o) {
    return (
      '<a class="linha-org" href="organela.html?id=' + o.id + '">' +
        '<span class="org-mini" style="background:' + o.cor + '">' + icone(o) + '</span>' +
        '<span class="org-info">' +
          '<strong>' + o.nome + '</strong>' +
          '<span>Na escola, é ' + o.apelido + '. ' + o.resumo + '</span>' +
        '</span>' +
        '<span class="marcas" aria-hidden="true">' + marcas(o) + '</span>' +
      '</a>'
    );
  }

  function grupo(titulo, sub, iconeUI, cor, itens) {
    if (!itens.length) return '';
    var glifo = window.svgUI ? window.svgUI(iconeUI) : '';
    return (
      '<section class="comparar-grupo">' +
        '<h2><span style="color:' + cor + ';display:inline-flex">' + glifo + '</span>' + titulo + '</h2>' +
        '<p class="grupo-sub">' + sub + '</p>' +
        itens.map(linha).join('') +
      '</section>'
    );
  }

  alvo.innerHTML =
    '<div class="placar-comparar">' +
      '<div class="placar-card animal">' +
        '<div class="placar-num">' + totalAnimal + '</div>' +
        '<div class="placar-rotulo">organelas na célula animal</div>' +
      '</div>' +
      '<div class="placar-card vegetal">' +
        '<div class="placar-num">' + totalVegetal + '</div>' +
        '<div class="placar-rotulo">organelas na célula vegetal</div>' +
      '</div>' +
    '</div>' +

    grupo('As duas células têm', 'Aparecem tanto na animal quanto na vegetal.', 'check', '#2563EB', ambas) +
    grupo('Só na célula animal', 'A célula vegetal não tem estas.', 'coracao', '#2563EB', soAnimal) +
    grupo('Só na célula vegetal', 'A célula animal não tem estas — são o que deixa a planta "planta".', 'estrela', '#16A34A', soVegetal);

  /* Resumo final em texto (bom para leitor de tela e para fechar a ideia). */
  alvo.insertAdjacentHTML('beforeend',
    '<p class="destaque">💡 <strong>Resumindo:</strong> as duas têm ' + ambas.length +
    ' organelas em comum. A vegetal ainda tem parede celular, cloroplasto e um vacúolo bem grande — ' +
    'por isso as plantas ficam firmes e fabricam o próprio alimento com a luz do sol.</p>'
  );
})();
