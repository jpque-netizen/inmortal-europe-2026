const CACHE='immortal-europe-en-v18';
const ASSETS=['./index.html','./manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>
    Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))
  ));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(url.includes('cdnjs.cloudflare.com')){
    e.respondWith(
      caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return resp;
      }))
    );
    return;
  }
  if(url.includes('app.js')||url.endsWith('/')||url.includes('index.html')){
    e.respondWith(
      fetch(e.request).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return resp;
      }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
