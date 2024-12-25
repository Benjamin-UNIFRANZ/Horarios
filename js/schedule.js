export class ScheduleSystem {
    constructor() {
        this.schedules = {
            weekdays: this.getWeekdaySchedule(),
            saturday: this.getSaturdaySchedule(),
            sunday: this.getSundaySchedule()
        };
        this.notificationSystem = null;
    }

    init(notificationSystem) {
        this.notificationSystem = notificationSystem;
        console.log('ScheduleSystem inicializado');
        this.startScheduleCheck();
    }

    startScheduleCheck() {
        console.log('Iniciando verificación de horarios');
        this.checkCurrentTime();
        setInterval(() => this.checkCurrentTime(), 60000);
    }

    getWeekdaySchedule() {
        return [
            // { time: '02:11', activity: 'Prueba de notificación', icon: 'bed' }, // Nueva hora de prueba
            { time: '05:50', activity: 'Levantarse-alistarse', icon: 'bed' },
            { time: '06:10', activity: 'Trotar 15 min', icon: 'running' },
            { time: '06:45', activity: 'Desayunar', icon: 'utensils' },
            { time: '07:10', activity: 'Estudiar', icon: 'book' },
            { time: '12:20', activity: 'Descanso', icon: 'couch' },
            { time: '13:30', activity: 'Almorzar', icon: 'utensils' },
            { time: '14:15', activity: 'Ir a entrenar gym', icon: 'dumbbell' },
            { time: '16:20', activity: 'Estudiar', icon: 'book' },
            { time: '18:30', activity: 'Descanso', icon: 'couch' },
            { time: '18:45', activity: 'Cenar', icon: 'utensils' },
            { time: '19:30', activity: 'Estudiar', icon: 'book' },
            { time: '21:00', activity: 'Lavarse los dientes', icon: 'tooth' },
            { time: '21:15', activity: 'Dormir', icon: 'moon' }
        ];
    }

    getSaturdaySchedule() {
        return [
            { time: '06:00', activity: 'Levantarse-alistarse', icon: 'bed' },
            { time: '06:30', activity: 'Trotar', icon: 'running' },
            { time: '07:15', activity: 'Desayunar', icon: 'utensils' },
            { time: '08:00', activity: 'Limpieza', icon: 'broom' },
            { time: '10:15', activity: 'Estudiar', icon: 'book' },
            { time: '12:00', activity: 'Descanso', icon: 'couch' },
            { time: '12:45', activity: 'Almorzar', icon: 'utensils' },
            { time: '14:00', activity: 'Gimnasio', icon: 'dumbbell' },
            { time: '16:15', activity: 'Estudiar', icon: 'book' },
            { time: '18:30', activity: 'Descanso', icon: 'couch' },
            { time: '18:45', activity: 'Cenar', icon: 'utensils' },
            { time: '19:30', activity: 'Estudiar', icon: 'book' },
            { time: '21:00', activity: 'Lavarse los dientes', icon: 'tooth' },
            { time: '21:15', activity: 'Dormir', icon: 'moon' }
        ];
    }

    getSundaySchedule() {
        return [
            { time: '06:00', activity: 'Levantarse-alistarse', icon: 'bed' },
            { time: '06:15', activity: 'Estudiar', icon: 'book' },
            { time: '09:20', activity: 'Descanso', icon: 'couch' },
            { time: '09:35', activity: 'Desayunamos', icon: 'utensils' },
            { time: '10:25', activity: 'Estudiar', icon: 'book' },
            { time: '12:10', activity: 'Descanso', icon: 'couch' },
            { time: '12:20', activity: 'Entrenar Gym', icon: 'dumbbell' },
            { time: '14:15', activity: 'Estudiar', icon: 'book' },
            { time: '15:00', activity: 'Almuerzo', icon: 'utensils' },
            { time: '16:25', activity: 'Estudiar', icon: 'book' },
            { time: '18:55', activity: 'Descanso', icon: 'couch' },
            { time: '17:20', activity: 'Cenar', icon: 'utensils' },
            { time: '20:10', activity: 'Estudiar', icon: 'book' },
            { time: '21:00', activity: 'Lavarse los dientes', icon: 'tooth' },
            { time: '21:15', activity: 'Dormir', icon: 'moon' }
        ];
    }
    
 async checkCurrentTime() {
        try {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const currentDay = now.getDay();
            
            console.log(`Verificando hora actual: ${currentTime}, Día: ${currentDay}`);
            
            let todaySchedule;
            if (currentDay === 0) todaySchedule = this.schedules.sunday;
            else if (currentDay === 6) todaySchedule = this.schedules.saturday;
            else todaySchedule = this.schedules.weekdays;

            console.log('Horario para hoy:', todaySchedule);
            const currentActivity = todaySchedule.find(item => item.time === currentTime);
            
            if (currentActivity) {
                console.log('Actividad encontrada:', currentActivity);
                await this.notificationSystem.showNotification(currentActivity);
            }
        } catch (error) {
            console.error('Error en checkCurrentTime:', error);
        }
    }
}