const CACHE_NAME = 'horario-v7';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './css/responsive.css',
    './js/app.js',
    './js/notifications.js',
    './js/schedule.js',
    './assets/icons/icon-192.png',
    './assets/sounds/notification.mp3',
    './assets/icons/badge.png',
    './assets/icons/book.png',
    './assets/icons/moon.png',
    './assets/icons/tooth.png',
    './assets/icons/utensils.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
            .catch(error => console.error('Error en instalación:', error))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys()
                .then(keys => Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) return cached;

                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseToCache))
                            .catch(console.error);

                        return response;
                    });
            })
            .catch(() => new Response('Sin conexión'))
    );
});

self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Actualización de horario',
        icon: './assets/icons/icon-192.png',
        badge: './assets/icons/badge.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Ir a la página principal'
            },
            {
                action: 'postpone',
                title: 'Posponer 5 minutos'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Mi Horario', options)
            .catch(error => console.error('Error en notificación:', error))
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clientList => {
                    if (clientList.length > 0) {
                        return clientList[0].focus();
                    }
                    return clients.openWindow('/');
                })
        );
    } else if (event.action === 'postpone') {
        setTimeout(() => {
            self.registration.showNotification('Mi Horario', {
                body: 'Recordatorio pendiente',
                icon: './assets/icons/icon-192.png',
                badge: './assets/icons/badge.png',
                vibrate: [200, 100, 200]
            });
        }, 5 * 60 * 1000);
    }
});