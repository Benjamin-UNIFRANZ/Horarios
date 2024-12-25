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