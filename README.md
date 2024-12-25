# Proyecto de Notificaciones de Horarios

## Descripción General

Este proyecto es un sistema de notificaciones de horarios que permite a los usuarios recibir notificaciones en momentos específicos del día. Las notificaciones incluyen un mensaje y un sonido de alerta. El sistema está diseñado para funcionar en navegadores modernos que soportan Service Workers y notificaciones push.

## Funcionalidad Principal

- **Notificaciones Programadas**: El sistema envía notificaciones en momentos específicos del día según un horario predefinido.
- **Sonido de Alerta**: Cada vez que se muestra una notificación, se reproduce un sonido de alerta.
- **Acciones en Notificaciones**: Las notificaciones incluyen acciones que permiten al usuario abrir la página principal o posponer la notificación.

## Configuración e Instalación

### Requisitos

- Navegador moderno con soporte para Service Workers y notificaciones push.
- Servidor web para servir los archivos del proyecto.

### Instalación

1. Clona el repositorio en tu máquina local:
    ```bash
    git clone https://github.com/tu-usuario/horarios.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd horarios
    ```

3. Sirve los archivos del proyecto usando un servidor web. Puedes usar `http-server` para este propósito:
    ```bash
    npx http-server
    ```

4. Abre tu navegador y navega a `http://localhost:8080` (o el puerto que `http-server` esté usando).

## Explicación del Código

### Estructura del Proyecto

- `index.html`: Archivo HTML principal que carga el sistema de notificaciones y horarios.
- `css`: Directorio que contiene los archivos CSS para el estilo de la página.
- `js`: Directorio que contiene los archivos JavaScript para la funcionalidad del proyecto.
  - `app.js`: Inicializa la aplicación y registra el Service Worker.
  - `notifications.js`: Maneja las notificaciones y la reproducción de sonido.
  - `schedule.js`: Define los horarios y verifica el tiempo actual para enviar notificaciones.
- `assets`: Directorio que contiene los recursos del proyecto como iconos y sonidos.
- `sw.js`: Service Worker que maneja la caché y las notificaciones push.

### `app.js`

Este archivo inicializa la aplicación y registra el Service Worker.

```javascript
import { NotificationSystem } from './notifications.js';
import { ScheduleSystem } from './schedule.js';

class App {
    constructor() {
        this.initializeApp();
    }

    async initializeApp() {
        await this.registerServiceWorker();
        
        const notificationSystem = new NotificationSystem();
        await notificationSystem.init();

        const scheduleSystem = new ScheduleSystem();
        scheduleSystem.init(notificationSystem);
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registrado');
            } catch (error) {
                console.error('Error al registrar SW:', error);
            }
        }
    }
}

window.addEventListener('load', () => new App());
```

### `notifications.js`

Este archivo maneja las notificaciones y la reproducción de sonido.

```javascript
export class NotificationSystem {
    constructor() {
        this.audioContext = null;
    }

    async init() {
        await this.requestNotificationPermission();
        this.setupAudioContext();
    }

    async requestNotificationPermission() {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.error('Permiso de notificación denegado');
        }
    }

    setupAudioContext() {
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        });
    }

    showNotification(activity) {
        const options = {
            body: activity.message,
            icon: 'assets/icon.png',
            actions: [
                { action: 'open', title: 'Abrir' },
                { action: 'snooze', title: 'Posponer' }
            ]
        };
        const notification = new Notification('Notificación de Horario', options);
        this.playNotificationSound();
    }

    playNotificationSound() {
        if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            oscillator.connect(this.audioContext.destination);
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 1);
        }
    }
}
```

### `schedule.js`

Este archivo define los horarios y verifica el tiempo actual para enviar notificaciones.

```javascript
import { NotificationSystem } from './notifications.js';

export class ScheduleSystem {
    constructor() {
        this.weekdaySchedule = this.getWeekdaySchedule();
        this.saturdaySchedule = this.getSaturdaySchedule();
        this.sundaySchedule = this.getSundaySchedule();
    }

    init(notificationSystem) {
        this.notificationSystem = notificationSystem;
        this.startScheduleCheck();
    }

    startScheduleCheck() {
        setInterval(() => this.checkCurrentTime(), 60000);
    }

    getWeekdaySchedule() {
        return [
            { time: '08:00', message: 'Hora de comenzar el trabajo' },
            { time: '12:00', message: 'Hora del almuerzo' },
            { time: '17:00', message: 'Hora de terminar el trabajo' }
        ];
    }

    getSaturdaySchedule() {
        return [
            { time: '10:00', message: 'Hora de comenzar el trabajo' },
            { time: '14:00', message: 'Hora del almuerzo' },
            { time: '18:00', message: 'Hora de terminar el trabajo' }
        ];
    }

    getSundaySchedule() {
        return [
            { time: '09:00', message: 'Hora de comenzar el trabajo' },
            { time: '13:00', message: 'Hora del almuerzo' },
            { time: '17:00', message: 'Hora de terminar el trabajo' }
        ];
    }

    checkCurrentTime() {
        const now = new Date();
        const currentTime = `${now.getHours()}:${now.getMinutes()}`;
        const day = now.getDay();
        let schedule;

        if (day === 0) {
            schedule = this.sundaySchedule;
        } else if (day === 6) {
            schedule = this.saturdaySchedule;
        } else {
            schedule = this.weekdaySchedule;
        }

        const activity = schedule.find(item => item.time === currentTime);
        if (activity) {
            this.notificationSystem.showNotification(activity);
        }
    }
}
```

### `sw.js`

Este archivo es el Service Worker que maneja la caché y las notificaciones push.

```javascript
const CACHE_NAME = 'horarios-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/notifications.js',
    '/js/schedule.js',
    '/assets/icon.png',
    '/assets/notification-sound.mp3'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME).map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', event => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'assets/icon.png',
        actions: [
            { action: 'open', title: 'Abrir' },
            { action: 'snooze', title: 'Posponer' }
        ]
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'open') {
        clients.openWindow('/');
    } else if (event.action === 'snooze') {
        // Lógica para posponer la notificación
    }
});
```