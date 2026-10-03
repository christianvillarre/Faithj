const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = __dirname;
const port = Number(process.env.PORT || 4173);

function build() {
  execFileSync(process.execPath, [path.join(root, 'build.js')], {
    cwd: root,
    stdio: 'inherit',
  });
}

build();

let rebuildTimer;
for (const folder of ['src', 'partials']) {
  fs.watch(path.join(root, folder), () => {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => {
      try {
        build();
        process.stdout.write('Pages updated. Refresh the preview.\n');
      } catch (error) {
        process.stderr.write(`Build failed: ${error.message}\n`);
      }
    }, 150);
  });
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  if (/^\/src\/[^/]+\.html$/.test(pathname)) {
    response.writeHead(302, { Location: pathname.slice(4) }).end();
    return;
  }
  if (/^\/(src|partials|\.git)(\/|$)/.test(pathname)) {
    response.writeHead(404).end('Not found');
    return;
  }

  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root + path.sep) || !types[path.extname(file).toLowerCase()]) {
    response.writeHead(404).end('Not found');
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()],
      'Cache-Control': 'no-store',
    });
    response.end(data);
  });
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Preview: http://127.0.0.1:${port}/\n`);
});
