/* Натискане на известие: винаги отваря радиото, без значение какъв линк е зададен.
   Регистрира се преди OneSignal, за да има предимство. */
const APP_URL = new URL("./", self.location).href; // напр. https://desicenov-vr.github.io/radio/
self.addEventListener("notificationclick", event => {
  event.stopImmediatePropagation();
  event.notification.close();
  event.waitUntil((async () => {
    const wins = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) {
      if (w.url.startsWith(APP_URL) && "focus" in w) return w.focus();
    }
    return clients.openWindow(APP_URL);
  })());
});

/* Известия (OneSignal) */
try { importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js"); } catch (e) {}

const CACHE = "interhit-v3";
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","favicon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.endsWith(".txt")) return; // потокът и съобщенията винаги на живо
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
