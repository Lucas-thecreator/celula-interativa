/* =========================================================================
   PROGRESSO E MEDALHAS  (progresso.js)
   -------------------------------------------------------------------------
   Guarda, SEM login, o que a criança já fez:
     - organelas que ela já abriu (explorou)
     - mini-quizzes que ela acertou
   e calcula MEDALHAS a partir disso (+ o selo do quiz final, que fica em
   'celulas_quiz'). Tudo em localStorage, no próprio aparelho.

   API:
     Progresso.marcarVisitada(id) / marcarQuizCerto(id)
     Progresso.visitou(id) / acertouQuiz(id)
     Progresso.totais()            -> { visitadas, quizCertos, total }
     Progresso.medalhas()          -> lista de medalhas (com conquistada:true/false)
     Progresso.aoMudar(fn)         -> avisa quando algo muda (mesma aba)
     Progresso.zerar()
   ========================================================================= */

window.Progresso = (function () {
  var CHAVE = 'celulas_progresso';
  var CHAVE_QUIZ = 'celulas_quiz';
  var ouvintes = [];

  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || {}; }
    catch (e) { return {}; }
  }
  function normalizar(p) {
    p.visitadas = p.visitadas || {};
    p.quizCertos = p.quizCertos || {};
    return p;
  }
  function salvar(p) {
    try { localStorage.setItem(CHAVE, JSON.stringify(p)); } catch (e) {}
    ouvintes.forEach(function (fn) { try { fn(); } catch (e) {} });
  }
  function temSelo() {
    try { return !!(JSON.parse(localStorage.getItem(CHAVE_QUIZ)) || {}).selo; }
    catch (e) { return false; }
  }
  function total() {
    return (window.ORGANELAS || []).length || 11;
  }
  function conta(obj) { return Object.keys(obj || {}).length; }

  function marcarVisitada(id) {
    if (!id) return;
    var p = normalizar(ler());
    if (!p.visitadas[id]) { p.visitadas[id] = true; salvar(p); }
  }
  function marcarQuizCerto(id) {
    if (!id) return;
    var p = normalizar(ler());
    if (!p.quizCertos[id]) { p.quizCertos[id] = true; salvar(p); }
  }
  function visitou(id) { return !!normalizar(ler()).visitadas[id]; }
  function acertouQuiz(id) { return !!normalizar(ler()).quizCertos[id]; }

  function totais() {
    var p = normalizar(ler());
    return { visitadas: conta(p.visitadas), quizCertos: conta(p.quizCertos), total: total() };
  }

  /* Lista das medalhas, em ordem de dificuldade. Cada uma diz se já foi
     conquistada e quanto falta (para mostrar "faltam 2"). */
  function medalhas() {
    var t = totais();
    var defs = [
      { id: 'primeiro-passo', nome: 'Primeiro passo',   icone: 'foguete', cor: '#F97316',
        desc: 'Explore a sua 1ª organela.', alvo: 1, valor: t.visitadas, tipo: 'explorar' },
      { id: 'explorador',     nome: 'Explorador(a)',    icone: 'lupa',    cor: '#2563EB',
        desc: 'Explore 5 organelas.',       alvo: 5, valor: t.visitadas, tipo: 'explorar' },
      { id: 'mestre',         nome: 'Mestre das organelas', icone: 'bussola', cor: '#0D9488',
        desc: 'Explore todas as ' + t.total + ' organelas.', alvo: t.total, valor: t.visitadas, tipo: 'explorar' },
      { id: 'craque-quiz',    nome: 'Craque dos testes', icone: 'estrela', cor: '#DB2777',
        desc: 'Acerte 6 testes rápidos.',   alvo: 6, valor: t.quizCertos, tipo: 'quiz' },
      { id: 'cientista',      nome: 'Cientista celular', icone: 'trofeu',  cor: '#CA8A04',
        desc: 'Acerte tudo no Quiz da Célula.', alvo: 1, valor: temSelo() ? 1 : 0, tipo: 'selo' }
    ];
    return defs.map(function (m) {
      m.conquistada = m.valor >= m.alvo;
      m.falta = Math.max(0, m.alvo - m.valor);
      return m;
    });
  }
  function totalMedalhas() { return medalhas().length; }
  function medalhasConquistadas() {
    return medalhas().filter(function (m) { return m.conquistada; }).length;
  }

  function aoMudar(fn) { if (typeof fn === 'function') ouvintes.push(fn); }
  function zerar() { salvar({ visitadas: {}, quizCertos: {} }); }

  /* Atualiza entre abas/janelas diferentes. */
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE || e.key === CHAVE_QUIZ) {
      ouvintes.forEach(function (fn) { try { fn(); } catch (err) {} });
    }
  });

  return {
    marcarVisitada: marcarVisitada,
    marcarQuizCerto: marcarQuizCerto,
    visitou: visitou,
    acertouQuiz: acertouQuiz,
    totais: totais,
    medalhas: medalhas,
    totalMedalhas: totalMedalhas,
    medalhasConquistadas: medalhasConquistadas,
    aoMudar: aoMudar,
    zerar: zerar
  };
})();
