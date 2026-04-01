const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3100;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
http.createServer((req, res) => {
  if (req.url.startsWith('/app/taschenrechner/api/')) {
    const file = req.url.split('/api/')[1].replace(/[^a-z0-9-]/g, '');
    const fp = path.join(__dirname, 'data', file + '.json');
    if (req.method === 'GET') { try { res.end(fs.readFileSync(fp)); } catch { res.end('{}'); } return; }
    if (req.method === 'PUT') { let b=''; req.on('data',c=>b+=c); req.on('end',()=>{ fs.writeFileSync(fp,b); res.end('{"ok":true}'); }); return; }
  }
  const fp = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  try { const d = fs.readFileSync(fp); res.writeHead(200, {'Content-Type': MIME[path.extname(fp)] || 'text/plain'}); res.end(d); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(PORT, () => console.log('Listening on ' + PORT));
