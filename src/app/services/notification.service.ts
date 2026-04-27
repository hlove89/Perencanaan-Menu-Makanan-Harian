import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  // Request izin notifikasi
  async requestPermission() {
    await LocalNotifications.requestPermissions();
  }

  // Kirim notifikasi sekarang
  async sendNow(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: Date.now(),
          schedule: { at: new Date() },
          sound: 'default',
        }
      ]
    });
  }

  // Jadwalkan notifikasi untuk waktu tertentu
  async scheduleNotification(title: string, body: string, hour: number, minute: number) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: hour * 60 + minute,
          schedule: { at: scheduledTime },
          sound: 'default',
        }
      ]
    });
  }

  async cancelNotification(id: number) {
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
  }
}