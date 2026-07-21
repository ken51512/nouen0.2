const CACHE='nouen-choja-v071-20260721-photo2';
const CORE=['./','./index.html','./icon-192.png','./icon-512.png','./manifest.json','./assets/crops/radish.jpg','./assets/crops/baby-leaf.png','./assets/crops/salad-lettuce.jpg','./assets/crops/komatsuna.jpg','./assets/crops/spinach.jpg','./assets/crops/lettuce.jpg','./assets/crops/basil.jpg','./assets/crops/tomato.jpg','./assets/crops/cucumber.jpg','./assets/crops/edamame.jpg','./assets/crops/broccoli.jpg','./assets/crops/snow-pea.jpg','./assets/crops/strawberry.jpg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
      const copy=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response;
  })));
});
