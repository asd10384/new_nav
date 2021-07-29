
console.log('worker.js 로딩');

self.addEventListener('push', async (event) => {
  const payload = event.data.json();
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    vibrate: payload.vibrate,
    tag: payload.tag,
    icon: payload.icon,
    badge: payload.badge,
    payload: payload.payload,
    url: payload.url,
  }));
});

self.addEventListener('notificationclick', async (event) => {
  var data = event.notification.data;
  event.notification.close();
  //event.waitUntil(clients.openWindow(data.url));
});
