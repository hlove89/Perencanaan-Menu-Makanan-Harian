import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences'; 
import { MenuFormPage } from './menu-form/menu-form.page';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {

  showCustomSplash = true;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showCustomSplash = false;
      this.setupNotifications();
    }, 2000);
  }

  async setupNotifications() {
    await this.notifService.requestPermission();
    
    // Hapus semua jadwal lama sebelum membuat yang baru
    await this.notifService.cancelAll();

    const getStoredTime = async (key: string, defaultHour: number) => {
      const { value } = await Preferences.get({ key: `jam_${key}` });
      if (value) {
        const date = new Date(value);
        return { hour: date.getHours(), minute: date.getMinutes() };
      }
      return { hour: defaultHour, minute: 0 };
    };

    const sarapan = await getStoredTime('sarapan', 7);
    const siang = await getStoredTime('siang', 12);
    const malam = await getStoredTime('malam', 18);
    const cemilan = await getStoredTime('cemilan', 15); 

    // Jadwalkan ulang dengan ID tetap agar sistem tidak bingung
    await this.notifService.scheduleNotification(
      '🍳 Sarapan Dulu Yuk!',
      'Pagi-pagi jangan lupa isi energi dulu.',
      sarapan.hour,
      sarapan.minute,
      1
    );

    await this.notifService.scheduleNotification(
      '🍲 Makan Siang Yuk!',
      'Sudah waktunya makan, istirahat dulu sebentar.',
      siang.hour,
      siang.minute,
      2
    );

    await this.notifService.scheduleNotification(
      '🍽️ Makan Malam Yuk!',
      'Hari mulai malam, waktunya makan dulu.',
      malam.hour,
      malam.minute,
      3
    );

    await this.notifService.scheduleNotification(
      '🍪 Ngemil Sebentar Yuk!',
      'Camilan ringan bisa bikin mood balik lagi.',
      cemilan.hour,
      cemilan.minute,
      4
    );
  }

  async openAddMenuModal() {
    const today = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const formattedDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    const modal = await this.modalCtrl.create({
      component: MenuFormPage,
      componentProps: {
        hari: formattedDate
      },
      cssClass: 'menu-form-modal'
    });

    await modal.present();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToMenu() {
    this.router.navigate(['/daftar-menu']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}