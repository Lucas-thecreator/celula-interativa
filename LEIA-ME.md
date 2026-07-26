# 🔬 Célula Interativa — site do protótipo

Site educativo e **acessível** que complementa o protótipo de célula em alto relevo.
Cada organela tem uma página com **imagem + áudio + texto** (analogia da escola), além de
**quiz com selo**, **gerador de QR Code** e **tutorial de montagem**. Funciona instalado no
celular e **offline** (PWA). Público: alunos do 6º ano, com foco em acessibilidade.

## 📂 O que tem aqui

```
index.html          → explorador da célula (diagrama + toggle animal/vegetal + lista)
organela.html       → página de cada organela (abre via ?id=...)
quiz.html           → quiz final, pontuação e selo de "Cientista Celular"
tutorial.html       → passo a passo "Como Montar"
qrcodes.html        → gerador de QR Codes para impressão
sobre.html          → objetivo do projeto e acessibilidade
data/organelas.js   → ⭐ TODO O CONTEÚDO (textos, analogias e quizzes) fica aqui
css/style.css       → cores, fontes, acessibilidade, alto contraste e modo escuro
js/tts.js           → camada de áudio (voz do navegador hoje; MP3 amanhã)
js/ler-ao-passar.js → fala o que está escrito no botão sob o mouse ou sob o foco
js/a11y.js          → barra de acessibilidade (fonte, contraste, escuro, voz…)
js/main.js          → explorador (home)
js/organela.js      → página da organela
js/quiz.js          → quiz final
js/qrcodes.js       → gerador de QR Codes
js/comum.js         → registra o modo offline (Service Worker) e o menu
manifest.webmanifest + sw.js → instalar no celular e funcionar offline (PWA)
img/                → coloque aqui as fotos das organelas
audio/              → (opcional) coloque aqui gravações em MP3
```

## ✏️ 1. Como trocar TEXTOS, ANALOGIAS e QUIZZES

Abra **`data/organelas.js`** num editor de texto. É o único arquivo de conteúdo. Cada
organela tem:

- `resumo` — frase curta (1 linha);
- `analogia` — texto principal (tema "escola"); **é o que o botão de áudio lê**;
- `funcao` — versão um tiquinho mais técnica;
- `quiz` — `{ pergunta, opcoes: [...], correta: <número da opção certa, começando em 0> }`.

Edite à vontade e salve. Para adicionar uma organela nova, copie um bloco e ajuste.

## 🖼️ 2. Como adicionar as FOTOS das organelas

Coloque as fotos na pasta `img/` com **exatamente estes nomes** (`.jpg`):

| Organela | Nome do arquivo |
|---|---|
| Membrana plasmática | `membrana-plasmatica.jpg` |
| Núcleo | `nucleo.jpg` |
| Mitocôndria | `mitocondria.jpg` |
| Citoplasma | `citoplasma.jpg` |
| Ribossomos | `ribossomo.jpg` |
| Retículo endoplasmático | `reticulo-endoplasmatico.jpg` |
| Complexo de Golgi | `complexo-de-golgi.jpg` |
| Centríolos | `centriolos.jpg` |
| Vacúolo | `vacuolo.jpg` |
| Cloroplasto | `cloroplasto.jpg` |
| Parede celular | `parede-celular.jpg` |

> ✅ **As 11 fotos do protótipo já estão na pasta `img/`.** Esta tabela serve para quando você
> quiser trocar alguma por uma foto melhor: é só salvar por cima, com o mesmo nome.
>
> Cuidado com dois nomes que não batem com o rótulo comum: a peça que você chama de
> **"parede vegetal"** é o arquivo **`parede-celular.jpg`**, e **ribossomos** e **cloroplastos**
> ficam no **singular** (`ribossomo.jpg`, `cloroplasto.jpg`).
>
> Enquanto uma foto não existir, o site mostra um quadrinho com o ícone e o nome da organela —
> então ele nunca fica quebrado.
>
> As fotos são exibidas **inteiras** (`contain`), não cortadas. Isso é de propósito: peças como
> a membrana e a parede celular são *contornos* com o miolo vazio, e um recorte quadrado comia
> justamente a borda, deixando o cartão em branco.
>
> **Licença (importante para vender):** use só fotos próprias (ex.: do seu protótipo montado)
> ou imagens de domínio público/CC0. Evite imagens aleatórias do Google.

### 📸 Fotos do passo a passo (tutorial.html)

O tutorial mostra uma foto por etapa. Salve em `img/` com **exatamente estes nomes**:

| # | Passo | Nome do arquivo |
|---|---|---|
| 1 | A base de isopor | `tutorial-1-base-isopor.jpg` |
| 2 | Forre a base com TNT branco | `tutorial-2-tnt-branco.jpg` |
| 3 | A parede celular | `tutorial-3-parede-celular.jpg` |
| 4 | O citoplasma | `tutorial-4-citoplasma.jpg` |
| 5 | Os contornos das organelas | `tutorial-5-contornos.jpg` |
| 6 | As organelas em EVA | `tutorial-6-organelas.jpg` |
| 7 | Velcro atrás de cada peça | `tutorial-7-velcro.jpg` |
| 8 | Célula vegetal pronta | `tutorial-8-vegetal.jpg` |
| 9 | Célula animal pronta | `tutorial-9-animal.jpg` |
| — | Foto grande no topo da página | `tutorial-resultado.jpg` |

> ✅ **As fotos do tutorial já estão na pasta `img/`.**
>
> Cada foto **some sozinha** enquanto o arquivo não existir, em vez de mostrar aquele ícone de
> imagem quebrada. Dá para trocar ou enviar fotos aos poucos, sem o tutorial ficar feio no
> meio do caminho.

## 🔊 3. Áudio: voz do navegador (padrão) ou gravação

Por padrão o site usa a **voz do navegador** (lê o campo `analogia` em português). Para usar
uma **gravação própria**: coloque o MP3 em `audio/` e preencha o campo `audio` da organela em
`data/organelas.js`, ex.: `audio: 'audio/mitocondria.mp3'`. Nenhuma página precisa mudar.

> ⚠️ Celulares bloqueiam áudio automático. Por isso o áudio só toca quando o aluno aperta o
> botão grande **“▶ Ouvir explicação”** — e nunca por cima do leitor de tela.

### 🎤 Como conseguir uma voz melhor

**Quem fornece a voz é o aparelho, não o site.** O site apenas pede "fale este texto" e usa a
melhor voz que encontrar. Por isso a mesma página soa ótima num celular e robótica em outro.

Em **⚙️ Mais opções → Voz** aparece a lista do aparelho. As marcadas com **⭐** têm
`Natural`, `Neural` ou `Online` no nome: são as modernas e soam quase humanas. O botão
**🎤 Testar voz** deixa ouvir antes de decidir, e a escolha fica salva.

| Onde você abre o site | O que costuma aparecer | Qualidade |
|---|---|---|
| **Chrome no Windows** | Microsoft Daniel, Microsoft Maria | 😐 antigas, metálicas |
| **Microsoft Edge** | ⭐ Francisca, Antonio, Thalita, Brenda *(Online Natural)* | 😍 a melhor de todas |
| **Celular Android** | ⭐ vozes do Google em português | 😃 muito boa |
| **iPhone / iPad** | ⭐ Luciana, Joana | 😃 muito boa |

> 👉 **Dica para a sala de aula:** se no computador da escola só aparecerem "Daniel" e "Maria",
> abra o site no **Microsoft Edge**. Ele já vem instalado no Windows e traz as vozes ⭐ de graça,
> sem instalar nada. É o jeito mais rápido de melhorar o áudio.

Se nem assim resolver, dá para **gravar a própria voz** (ou a de um aluno!) em MP3 e apontar
no campo `audio` da organela — aí o site usa a gravação e ignora a voz do navegador.

> 🔧 Detalhe técnico: o site fala em **pedaços de até 180 caracteres**, não de uma vez só.
> Chrome e Edge cortam a fala por volta dos 15 segundos, principalmente nas vozes Online;
> quebrando em frases, cada pedaço termina antes disso e o aluno ouve o texto inteiro.

## 🌐 4. Como PUBLICAR e ATUALIZAR

Este projeto está publicado no **GitHub Pages**:
`https://lucas-thecreator.github.io/celula-interativa/`

**Para atualizar o site depois de mexer em algum arquivo:**
```bash
git add -A
git commit -m "descreva a mudança"
git push
```
Em ~1 minuto o GitHub Pages atualiza sozinho.

> ⚠️ Sempre que mudar **css/js**, aumente o número em `CACHE` dentro de `sw.js`
> (ex.: `celula-interativa-v2` → `v3`). Isso garante que os celulares peguem a versão nova
> e não fiquem com o site "desatualizado" no cache offline.

**Alternativa sem git — Netlify Drop:** acesse **https://app.netlify.com/drop** e arraste a
pasta inteira. Ele gera um endereço na hora (crie uma conta grátis para mantê-lo no ar).

> O modo offline (PWA) e a instalação no celular só funcionam no site **publicado** (https),
> não abrindo o arquivo direto no computador.

## 🔗 5. Como gerar os QR CODES

1. Abra `qrcodes.html` (no site publicado).
2. Cole o **endereço do site publicado** no campo indicado.
3. Clique em **Gerar QR Codes** e depois em **🖨 Imprimir**.
4. Recorte e cole cada QR Code no verso do cartão da organela correspondente.

## 🧪 6. Quiz e selo

`quiz.html` reúne uma pergunta de cada organela. Ao acertar todas, o aluno ganha o selo de
**Cientista Celular**. O progresso fica salvo no próprio aparelho (sem login).

## ♿ Acessibilidade já incluída

No topo de todas as páginas há **um único botão: ♿ Acessibilidade**. Ele abre um painel com
todos os ajustes. As escolhas ficam salvas no próprio aparelho, então valem para as próximas
visitas e para todas as páginas — inclusive se o painel fica aberto ou fechado.

Quando há ajustes ligados, o botão mostra um contador (**“3 ativas”**). Sem ele, quem pegasse
o computador com alto contraste já ligado não teria pista de onde desligar, já que os
controles ficam escondidos.

**Dentro do painel:**

- **Tamanho do texto** — A− / A+.
- **Cores** — alto contraste (preto e amarelo) e modo escuro.
- **Ler em voz alta**
  - **🔊 Ler ao passar** — o site **fala o que está escrito** no botão ou link em que o aluno
    parar o mouse, ou que receber o foco pela tecla **Tab**. Serve para quem tem baixa visão,
    dislexia ou ainda está aprendendo a ler, sem precisar instalar leitor de tela.
  - **▶️ Ler esta página** — lê o conteúdo principal em voz alta.
  - **🔇 Parar a leitura**.
- **Voz** — lista as vozes em português do aparelho, com ⭐ nas melhores, e um botão
  **🎤 Testar voz**. Veja *"Como conseguir uma voz melhor"* na seção 3.
- **Velocidade da voz** — 🐢 devagar, normal ou 🐇 rápida.
- **Mais ajustes**
  - **🔤 Fonte legível** — troca as fontes decorativas por uma fonte sem curvas e com mais
    espaço entre letras e linhas (recomendação comum para dislexia).
  - **🎬 Menos animação** — desliga transições e movimentos.
  - **🖱️ Realce do foco** — contorno laranja bem grosso no que está sob o mouse ou sob o
    cursor do teclado.
- **↺ Restaurar o padrão** e **✕ Fechar**.

**Detalhes que importam:**

- A leitura por voz **nasce desligada** — áudio que começa sozinho atrapalha mais do que ajuda.
- A tecla **Esc** silencia o áudio a qualquer momento, em qualquer página.
- No **celular** a leitura por passagem não dispara: lá o dedo que "passa" é o mesmo que
  clica, e falar no toque bagunçaria a navegação.
- A leitura por passagem **nunca fala por cima** da explicação da organela.
- Emojis e setinhas são removidos antes de falar (senão a voz tenta pronunciá-los).
- Compatível com **leitor de tela** (TalkBack/VoiceOver) — textos, títulos em ordem e imagens descritas.
- **Diagrama** com pontos clicáveis **e** lista de texto como alternativa.
- Navegação por **teclado** com foco bem visível; nada depende só de cor.

> Quer que um botão seja lido com outras palavras? Coloque `data-falar="o que a voz deve
> dizer"` nele no HTML — isso vale mais que o texto que está na tela.

## 💰 Pronto para monetizar depois

- O tutorial está num bloco fácil de **travar** (classe `.travado` no `tutorial.html`) para
  virar conteúdo premium (kit pago / Hotmart / Kiwify).
- A URL base dos QR Codes é configurável, então dá para republicar sem refazer nada.

## 👀 Pré-visualizar no computador

Com Node instalado, rode `node _serve.js` na pasta e abra `http://localhost:5173`.
