import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createSiteServer } from '../server.mjs';

test('public website, fonts and images are served; project internals stay private', async () => {
  const server = createSiteServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [file, mime] of [['/', 'text/html'], ['/styles.css', 'text/css'], ['/app.js', 'text/javascript'], ['/assets/architecture-640.webp', 'image/webp'], ['/assets/manrope-latin.woff2', 'font/woff2']]) {
      const response = await fetch(base + file);
      assert.equal(response.status, 200, file);
      assert.ok(response.headers.get('content-type').startsWith(mime), file);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.ok(response.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
      assert.ok((await response.arrayBuffer()).byteLength > 0);
    }
    for (const file of ['/server.mjs', '/package.json', '/.env', '/forma-studio-project.zip', '/assets/%2e%2e/server.mjs', '/%zz']) assert.equal((await fetch(base + file)).status, 404, file);
    const head = await fetch(base + '/', { method: 'HEAD' });
    assert.equal(head.status, 200); assert.equal(await head.text(), '');
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test('globalThis.matchMedia fallback is defined and functional in server environment', () => {
  assert.equal(typeof globalThis.matchMedia, 'function');
  const mql = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
  assert.equal(typeof mql, 'object');
  assert.equal(mql.matches, false);
  assert.equal(mql.media, '(prefers-reduced-motion: reduce)');
  assert.equal(typeof mql.addEventListener, 'function');
  assert.equal(typeof mql.removeEventListener, 'function');
  assert.doesNotThrow(() => mql.addEventListener('change', () => {}));
});

test('client scripts evaluate cleanly in Node.js runtime without SSR/cold-start crash', async () => {
  // Simulates cold-start evaluation of client scripts in serverless Node.js container
  await assert.doesNotReject(async () => {
    await import('../app.js');
  });
  await assert.doesNotReject(async () => {
    await import('../dist/app.js');
  });
});

