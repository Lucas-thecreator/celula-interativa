// Servidor estático simples só para pré-visualização local.
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PORT = 5173;
const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.jpg':'image/jpeg',
  '.png':'image/png', '.svg':'image/svg+xml', '.mp3':'audio/mpeg', '.md':'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('404'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('Servindo em http://localhost:' + PORT));
