/* AÇAIZEIRO — SERVICE WORKER DO SITE DOS CLIENTES
 * Permite instalar o site como app. Sempre busca a versão nova na internet;
 * usa a cópia guardada só se estiver sem conexão. Dados (Supabase) nunca ficam em cache.
 * Ao publicar uma nova versão, aumente o número abaixo. */
const VERSAO = 'acaizeiro-site-v3';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => Promise.all(['./', './index.html', './PURO.png', './LOGO2.png', './logo1.png'].map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('acaizeiro-site-') && k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return;
  if (url.origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((resp) => {
    if (resp.ok) { const copia = resp.clone(); caches.open(VERSAO).then((c) => c.put(req, copia)); }
    return resp;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))));
});
