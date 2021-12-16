let staticCacheName = "pwa-v" + new Date().getTime();
let filesToCache = [
   '/css/app.css',
   '/js/app.js',
   'favicon.ico',
   '/icons/ios/16.png',
   '/icons/ios/32.png',
   '/icons/ios/64.png',
   '/icons/ios/72.png',
   '/icons/ios/80.png',
   '/icons/ios/100.png',
   '/icons/ios/120.png',
   '/icons/ios/144.png',
   '/icons/ios/152.png',
   '/icons/ios/167.png',
   '/icons/ios/180.png',
   '/icons/ios/192.png',
   '/icons/ios/256.png',
   '/icons/ios/512.png',
   '/icons/ios/1024.png',
   // add your favicons and maskable icons 
   // and add any other resource you want to be cached 
];

// Cache on install  
self.addEventListener("install", event => {
   this.skipWaiting();
   event.waitUntil(
       caches.open(staticCacheName)
       .then(cache => {
           return cache.addAll(filesToCache);
       })
   )
});

// Clear cache on activate  
self.addEventListener('activate', event => {
   event.waitUntil(
       caches.keys().then(cacheNames => {
           return Promise.all(
               cacheNames
               .filter(cacheName => (cacheName.startsWith("pwa-")))
               .filter(cacheName => (cacheName !== staticCacheName))
               .map(cacheName => caches.delete(cacheName))
           );
       })
   );
});

// Serve from Cache  
self.addEventListener("fetch", event => {
   event.respondWith(
       caches.match(event.request)
       .then(response => {
           return response || fetch(event.request);
       })
       .catch(() => {
           return caches.match('offline');
       })
   )
});