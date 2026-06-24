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
js/a11y.js          → barra de acessibilidade (A+/A−, alto contraste, modo escuro)
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

> Enquanto a foto não existir, o site mostra um quadrinho com o emoji e o nome da organela —
> então ele já funciona sem as fotos.
>
> **Licença (importante para vender):** use só fotos próprias (ex.: do seu protótipo montado)
> ou imagens de domínio público/CC0. Evite imagens aleatórias do Google.

## 🔊 3. Áudio: voz do navegador (padrão) ou gravação

Por padrão o site usa a **voz do navegador** (lê o campo `analogia` em português). Para usar
uma **gravação própria**: coloque o MP3 em `audio/` e preencha o campo `audio` da organela em
`data/organelas.js`, ex.: `audio: 'audio/mitocondria.mp3'`. Nenhuma página precisa mudar.

> ⚠️ Celulares bloqueiam áudio automático. Por isso o áudio só toca quando o aluno aperta o
> botão grande **“▶ Ouvir explicação”** — e nunca por cima do leitor de tela.

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

- Botões de **aumentar/diminuir fonte**, **alto contraste** e **modo escuro** (com memória).
- Compatível com **leitor de tela** (TalkBack/VoiceOver) — textos, títulos em ordem e imagens descritas.
- **Diagrama** com pontos clicáveis **e** lista de texto como alternativa.
- Navegação por **teclado** com foco bem visível; nada depende só de cor.

## 💰 Pronto para monetizar depois

- O tutorial está num bloco fácil de **travar** (classe `.travado` no `tutorial.html`) para
  virar conteúdo premium (kit pago / Hotmart / Kiwify).
- A URL base dos QR Codes é configurável, então dá para republicar sem refazer nada.

## 👀 Pré-visualizar no computador

Com Node instalado, rode `node _serve.js` na pasta e abra `http://localhost:5173`.
