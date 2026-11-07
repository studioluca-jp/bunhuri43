/* ファイルや価格を変えたら VERSION を上げること。オンラインで開き直すと新しい内容に入れ替わります。 */
var VERSION = "4";
var PREFIX = "bunhuri43-staff-";
var CACHE = PREFIX + VERSION;
var FILES = [
  "./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png",
  "../img/bathsalt.webp", "../img/olNormal.webp", "../img/harisenNormal.webp", "../img/mizunoNormal.webp",
  "../img/olYuwaa.webp", "../img/harisenYuwaa.webp", "../img/mizunoYuwaa.webp",
  "../img/wake2026summer.webp", "../img/wake2026spring.webp", "../img/wake2025winter.webp",
  "../img/denimCap.webp", "../img/parka.webp", "../img/sweatPants.webp", "../img/randomSticker.webp",
  "../img/logoSticker.webp", "../img/tumbler.webp"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: "reload" }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf(PREFIX) === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { cacheName: CACHE, ignoreSearch: true }).then(function (r) {
    return r || fetch(e.request).catch(function (err) {
      if (e.request.mode === "navigate") return caches.match("./", { cacheName: CACHE });
      throw err;
    });
  }));
});
