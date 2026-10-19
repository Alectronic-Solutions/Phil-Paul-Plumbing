import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('out');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname.replace(/\/$/, '') === '/book-service') {
      response.writeHead(301, { Location: '/book-plumbing-services/' });
      response.end();
      return;
    }
    if (url.pathname.startsWith('/api/')) {
      response.writeHead(503, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ ok: false, error: 'Online requests are not connected yet. Please call (209) 366-2319.' }));
      return;
    }
    let target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (target !== root && !target.startsWith(root + path.sep)) throw new Error('Invalid path');
    let details = await stat(target).catch(() => null);
    if (details?.isDirectory()) target = path.join(target, 'index.html');
    let bytes = await readFile(target).catch(() => null);
    if (!bytes) {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end(await readFile(path.join(root, '404.html')));
      return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'X-Robots-Tag': 'noindex, nofollow' });
    response.end(bytes);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
