export class NotificationSystem {
    constructor() {
        this.audioContext = null;
        this.setupAudioContext();
    }

    async init() {
        try {
            await this.requestNotificationPermission();
            console.log('NotificationSystem inicializado');
        } catch (error) {
            console.error('Error en init:', error);
        }
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.error('Este navegador no soporta notificaciones');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Permiso de notificaciones denegado');
            }
        } catch (error) {
            console.error('Error solicitando permisos:', error);
        }
    }

    setupAudioContext() {
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    }

    async showNotification(activity) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('Mi Horario', {
            body: `Es hora de: ${activity.activity}`,
            icon: `./assets/icons/${activity.icon}.png`,
            badge: './assets/icons/badge.png',
            tag: 'horario-notification',
            renotify: true,
            requireInteraction: true,
            vibrate: [200, 100, 200],
            actions: [
                {
                    action: 'open',
                    title: 'Ir a la página principal'
                },
                {
                    action: 'postpone',
                    title: 'Posponer 5min'
                }
            ]
        });

        await this.playNotificationSound();
    }

    async playNotificationSound() {
        if (this.audioContext) {
            const audio = new Audio('./assets/sounds/notification.mp3');
            const source = this.audioContext.createMediaElementSource(audio);
            source.connect(this.audioContext.destination);
            await audio.play();
        } else {
            const audio = new Audio('./assets/sounds/notification.mp3');
            await audio.play();
        }
    }
}