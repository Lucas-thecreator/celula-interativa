/* =========================================================================
   DADOS DAS ORGANELAS  —  Célula Interativa
   -------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar para mudar o CONTEÚDO.
   Para adicionar uma nova organela (ou uma nova célula no futuro), basta
   acrescentar um objeto nesta lista — nenhuma página precisa ser reescrita.

   Campos de cada organela:
     id        -> identificador usado na URL e no QR Code (sem acento/espaço)
     nome      -> nome que aparece na tela
     apelido   -> "papel na escola" (ex.: "o portão") — usado como subtítulo
     celulas   -> em quais células aparece: ['animal'], ['vegetal'] ou as duas
     emoji     -> ícone simples usado nos cartões e no diagrama
     cor       -> cor do ponto no diagrama (NUNCA é a única forma de identificar:
                  todo ponto também tem rótulo de texto)
     img       -> caminho da foto 3D (coloque o arquivo em /img). Se não existir,
                  o site mostra um placeholder com o nome da organela.
     audio     -> (opcional) caminho de um MP3 gravado. Se vazio, usa a voz do
                  navegador (TTS). Trocar TTS por MP3 depois é só preencher aqui.
     resumo    -> frase curta (1 linha), aparece no cartão e na lista
     analogia  -> TEXTO PRINCIPAL (tema "escola"). É o que o botão de áudio lê.
     funcao    -> versão um tiquinho mais técnica ("função na célula")
     mapa      -> posição do ponto no diagrama da home, em % { x, y }
     quiz      -> { pergunta, opcoes: [...], correta: <índice da opção certa> }

   NOTA DE CÓDIGO: este arquivo é carregado com <script> comum (não ES module)
   de propósito — assim o site também funciona aberto direto do arquivo
   (file://), sem precisar de servidor, o que ajuda professores e a impressão
   local dos QR Codes.
   ========================================================================= */

window.ORGANELAS = [
  /* ---------- Presentes nas DUAS células ---------- */
  {
    id: 'membrana-plasmatica',
    nome: 'Membrana plasmática',
    apelido: 'o portão',
    celulas: ['animal', 'vegetal'],
    emoji: '🚪',
    cor: '#2563EB',
    img: 'img/membrana-plasmatica.jpg',
    audio: '',
    resumo: 'Protege a célula e controla quem entra e quem sai.',
    analogia:
      'Funciona como o portão da escola, com o inspetor. Ele decide quem entra e ' +
      'quem sai: deixa entrar os alunos e o que a escola precisa, e deixa sair quem ' +
      'já vai embora.',
    funcao: 'Controla a entrada e a saída de substâncias da célula e a protege.',
    mapa: { x: 50, y: 9 },
    quiz: {
      pergunta: 'Quem na célula funciona como o portão da escola, controlando o que entra e sai?',
      opcoes: ['Núcleo', 'Membrana plasmática', 'Ribossomo', 'Vacúolo'],
      correta: 1
    }
  },
  {
    id: 'nucleo',
    nome: 'Núcleo',
    apelido: 'a diretoria',
    celulas: ['animal', 'vegetal'],
    emoji: '🏛️',
    cor: '#7C3AED',
    img: 'img/nucleo.jpg',
    audio: '',
    resumo: 'Comanda as atividades da célula.',
    analogia:
      'Funciona como a sala da direção, de onde tudo é comandado. É lá que ficam ' +
      'guardadas as regras e os documentos da escola (o DNA), com as informações de ' +
      'como tudo deve funcionar.',
    funcao: 'Guarda o DNA e comanda as atividades da célula.',
    mapa: { x: 50, y: 50 },
    quiz: {
      pergunta: 'Qual organela é como a sala da direção, que comanda tudo e guarda os documentos (o DNA)?',
      opcoes: ['Citoplasma', 'Núcleo', 'Complexo de Golgi', 'Membrana plasmática'],
      correta: 1
    }
  },
  {
    id: 'mitocondria',
    nome: 'Mitocôndria',
    apelido: 'a cantina',
    celulas: ['animal', 'vegetal'],
    emoji: '🍽️',
    cor: '#F97316',
    img: 'img/mitocondria.jpg',
    audio: '',
    resumo: 'Dá energia para a célula funcionar.',
    analogia:
      'Funciona como a cantina, onde a comida vira energia. É ali que os alimentos se ' +
      'transformam no pique que todo mundo usa para estudar, brincar e se movimentar.',
    funcao: 'Produz a energia que a célula usa para funcionar.',
    mapa: { x: 25, y: 32 },
    quiz: {
      pergunta: 'A mitocôndria é parecida com qual lugar da escola?',
      opcoes: ['A cantina', 'O portão', 'A diretoria', 'Os corredores'],
      correta: 0
    }
  },
  {
    id: 'citoplasma',
    nome: 'Citoplasma',
    apelido: 'o espaço interno da escola',
    celulas: ['animal', 'vegetal'],
    emoji: '🏫',
    cor: '#0EA5E9',
    img: 'img/citoplasma.jpg',
    audio: '',
    resumo: 'É onde as organelas ficam e onde muito trabalho acontece.',
    analogia:
      'Funciona como todo o ambiente dentro da escola, que preenche o prédio e onde ' +
      'ficam todos os setores. É por ali que tudo circula e muita coisa acontece.',
    funcao: 'Preenche a célula, abriga as organelas e é onde muitas reações acontecem.',
    mapa: { x: 33, y: 74 },
    quiz: {
      pergunta: 'O que funciona como todo o espaço interno da escola, onde ficam os setores (as organelas)?',
      opcoes: ['O núcleo', 'A parede celular', 'O citoplasma', 'O ribossomo'],
      correta: 2
    }
  },
  {
    id: 'ribossomo',
    nome: 'Ribossomos',
    apelido: 'as salas de aula',
    celulas: ['animal', 'vegetal'],
    emoji: '📚',
    cor: '#DB2777',
    img: 'img/ribossomo.jpg',
    audio: '',
    resumo: 'Produzem proteínas para a célula.',
    analogia:
      'Funcionam como as salas, onde o trabalho principal é feito. É ali que se ' +
      '"produz" o mais importante — assim como os ribossomos produzem as proteínas, ' +
      'essenciais para a célula funcionar e se construir.',
    funcao: 'Produzem as proteínas da célula.',
    mapa: { x: 66, y: 30 },
    quiz: {
      pergunta: 'Como as salas de aula, onde o trabalho principal acontece, quem produz as proteínas da célula?',
      opcoes: ['Os ribossomos', 'Os centríolos', 'O vacúolo', 'O cloroplasto'],
      correta: 0
    }
  },
  {
    id: 'reticulo-endoplasmatico',
    nome: 'Retículo endoplasmático',
    apelido: 'os corredores',
    celulas: ['animal', 'vegetal'],
    emoji: '🚶',
    cor: '#0D9488',
    img: 'img/reticulo-endoplasmatico.jpg',
    audio: '',
    resumo: 'Produz e transporta substâncias.',
    analogia:
      'Funcionam como os corredores que ligam uma sala à outra. Eles ajudam a produzir ' +
      'proteínas e gorduras e levam essas substâncias de um lugar para outro dentro da ' +
      'escola.',
    funcao: 'Ajuda a produzir e a transportar proteínas e gorduras pela célula.',
    mapa: { x: 38, y: 62 },
    quiz: {
      pergunta: 'Quem funciona como os corredores que ligam as salas, ajudando a produzir e transportar substâncias?',
      opcoes: ['O núcleo', 'O retículo endoplasmático', 'A membrana plasmática', 'A cantina'],
      correta: 1
    }
  },
  {
    id: 'complexo-de-golgi',
    nome: 'Complexo de Golgi',
    apelido: 'a secretaria',
    celulas: ['animal', 'vegetal'],
    emoji: '🗂️',
    cor: '#CA8A04',
    img: 'img/complexo-de-golgi.jpg',
    audio: '',
    resumo: 'Organiza e distribui substâncias.',
    analogia:
      'Funciona como a secretaria, que organiza, carimba e envia os documentos. Ela ' +
      'arruma, empacota e despacha o que a escola produz.',
    funcao: 'Empacota, organiza e distribui as substâncias produzidas pela célula.',
    mapa: { x: 68, y: 60 },
    quiz: {
      pergunta: 'Qual organela é como a secretaria, que organiza, empacota e despacha o que a célula produz?',
      opcoes: ['O complexo de Golgi', 'A mitocôndria', 'O núcleo', 'Os centríolos'],
      correta: 0
    }
  },

  /* ---------- Somente CÉLULA ANIMAL ---------- */
  {
    id: 'centriolos',
    nome: 'Centríolos',
    apelido: 'a equipe que monta as novas turmas',
    celulas: ['animal'],
    emoji: '👥',
    cor: '#E11D48',
    img: 'img/centriolos.jpg',
    audio: '',
    resumo: 'Ajudam a dividir a célula corretamente.',
    analogia:
      'Funcionam como a coordenação que, quando precisa formar uma turma nova, organiza ' +
      'e separa os alunos para que cada turma fique completa e certinha.',
    funcao: 'Ajudam a célula a se dividir de forma organizada.',
    mapa: { x: 50, y: 78 },
    quiz: {
      pergunta: 'Quem ajuda a célula a se dividir, como a coordenação que separa os alunos em turmas novas?',
      opcoes: ['O cloroplasto', 'Os centríolos', 'O citoplasma', 'A parede celular'],
      correta: 1
    }
  },

  /* ---------- Somente CÉLULA VEGETAL ---------- */
  {
    id: 'vacuolo',
    nome: 'Vacúolo',
    apelido: "a caixa d'água e o depósito",
    celulas: ['vegetal'],
    emoji: '💧',
    cor: '#0284C7',
    img: 'img/vacuolo.jpg',
    audio: '',
    resumo: 'Armazena água e substâncias e mantém a célula firme.',
    analogia:
      "Funciona como a caixa d'água e o depósito da escola, que guardam água e mantêm " +
      'tudo abastecido. Nas plantas ele é bem grande e fica cheio de água, deixando a ' +
      'célula firme e "em pé" — igual a uma escola que precisa de água guardada para ' +
      'não faltar nada.',
    funcao: 'Armazena água e substâncias e ajuda a manter a célula firme.',
    mapa: { x: 30, y: 46 },
    quiz: {
      pergunta: "Na célula vegetal, quem é como a caixa d'água e o depósito, guardando água e deixando a célula firme?",
      opcoes: ['O vacúolo', 'O núcleo', 'O ribossomo', 'A membrana plasmática'],
      correta: 0
    }
  },
  {
    id: 'cloroplasto',
    nome: 'Cloroplasto',
    apelido: 'a horta que cozinha com a luz do sol',
    celulas: ['vegetal'],
    emoji: '🌱',
    cor: '#16A34A',
    img: 'img/cloroplasto.jpg',
    audio: '',
    resumo: 'Produz alimento usando a luz do sol.',
    analogia:
      'Funciona como uma horta da escola que usa a luz do sol para produzir o próprio ' +
      'alimento. É ali que a luz vira comida (açúcar) para a planta — por isso as ' +
      'plantas não precisam comprar merenda, elas mesmas fabricam com o sol.',
    funcao: 'Faz a fotossíntese: produz alimento para a planta usando a luz do sol.',
    mapa: { x: 72, y: 42 },
    quiz: {
      pergunta: 'Qual organela é como uma horta que usa a luz do sol para fabricar o próprio alimento (fotossíntese)?',
      opcoes: ['A mitocôndria', 'O cloroplasto', 'O vacúolo', 'O complexo de Golgi'],
      correta: 1
    }
  },
  {
    id: 'parede-celular',
    nome: 'Parede celular',
    apelido: 'o muro da escola',
    celulas: ['vegetal'],
    emoji: '🧱',
    cor: '#92400E',
    img: 'img/parede-celular.jpg',
    audio: '',
    resumo: 'Dá sustentação e proteção extra à célula.',
    analogia:
      'Funciona como o muro firme que cerca a escola por fora. Se a membrana é o portão ' +
      '(que controla quem entra e sai), a parede é o muro que dá firmeza e uma proteção ' +
      'extra, deixando a estrutura resistente.',
    funcao: 'Dá sustentação e proteção a mais para a célula vegetal, por fora da membrana.',
    mapa: { x: 50, y: 95 },
    quiz: {
      pergunta: 'Se a membrana é o portão, quem é o muro que cerca a célula vegetal por fora, dando proteção extra?',
      opcoes: ['O citoplasma', 'O núcleo', 'A parede celular', 'Os centríolos'],
      correta: 2
    }
  }
];

/* ---- Funções auxiliares usadas pelas páginas ---- */

/* Busca uma organela pelo id (página da organela). */
window.getOrganela = function (id) {
  return window.ORGANELAS.find(function (o) { return o.id === id; });
};

/* Lista as organelas de um tipo de célula ('animal' ou 'vegetal'),
   mantendo a ordem de cima — útil para a grade e para "anterior/próxima". */
window.organelasPorCelula = function (celula) {
  return window.ORGANELAS.filter(function (o) {
    return o.celulas.indexOf(celula) !== -1;
  });
};
