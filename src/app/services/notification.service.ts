import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  async requestPermission() {
    await LocalNotifications.requestPermissions();
  }

  async cancelAll() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }
  }

  async scheduleNotification(title: string, body: string, hour: number, minute: number, id: number) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: id, 
          schedule: { at: scheduledTime },
          sound: 'default',
        }
      ]
    });
  }
}