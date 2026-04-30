import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {

  waktuSarapan: string = '07:00';
  waktuMakanSiang: string = '12:00';
  waktuMakanMalam: string = '19:00';
  waktuCemilan: string = '16:00';

  constructor(private notifService: NotificationService) {}

  async ngOnInit() {
    await this.loadSavedTimes();
  }

  async loadSavedTimes() {
    const sarapan = await Preferences.get({ key: 'jam_sarapan' });
    const siang = await Preferences.get({ key: 'jam_makan_siang' });
    const malam = await Preferences.get({ key: 'jam_makan_malam' });
    const cemilan = await Preferences.get({ key: 'jam_cemilan' });

    if (sarapan.value) this.waktuSarapan = sarapan.value;
    if (siang.value) this.waktuMakanSiang = siang.value;
    if (malam.value) this.waktuMakanMalam = malam.value;
    if (cemilan.value) this.waktuCemilan = cemilan.value;
  }

  async simpanWaktu(jenis: string, nilai: string) {
    await Preferences.set({ 
      key: `jam_${jenis}`, 
      value: nilai 
    });
    await this.updateNotifications();
  }

  async updateNotifications() {
    try {
      await this.notifService.requestPermission();
      await this.notifService.cancelAll();

      // Helper untuk handle format "01:00" maupun "01.00"
      const parse = (time: string) => {
        const normalized = time.replace('.', ':');
        const [h, m] = normalized.split(':').map(Number);
        return { h: h || 0, m: m || 0 };
      };

      const s = parse(this.waktuSarapan);
      const si = parse(this.waktuMakanSiang);
      const m = parse(this.waktuMakanMalam);
      const c = parse(this.waktuCemilan);

      await this.notifService.scheduleNotification('🍳 Sarapan Dulu Yuk!', 'Pagi-pagi jangan lupa isi energi.', s.h, s.m, 1);
      await this.notifService.scheduleNotification('🍲 Makan Siang Yuk!', 'Istirahat sejenak dan makan siang.', si.h, si.m, 2);
      await this.notifService.scheduleNotification('🍽️ Makan Malam Yuk!', 'Waktunya makan malam agar tetap fit.', m.h, m.m, 3);
      await this.notifService.scheduleNotification('🍪 Ngemil Sebentar Yuk!', 'Cemilan bisa bantu mood kamu.', c.h, c.m, 4);
    } catch (error) {
      console.error('Gagal memperbarui notifikasi', error);
    }
  }

  async resetWaktu() {
    this.waktuSarapan = '07:00';
    this.waktuMakanSiang = '12:00';
    this.waktuMakanMalam = '19:00';
    this.waktuCemilan = '16:00';
    await Preferences.clear();
    await this.updateNotifications();
  }
}