import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MenuFormPage } from './menu-form/menu-form.page';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private notifService: NotificationService
  ) {
    this.setupNotifications();
  }

  async setupNotifications() {
    await this.notifService.requestPermission();
    await this.notifService.scheduleNotification('🍳 Waktunya Sarapan!', 'Jangan lupa sarapan pagi ini', 7, 0);
    await this.notifService.scheduleNotification('🍲 Waktunya Makan Siang!', 'Sudah siap menu siang?', 12, 0);
    await this.notifService.scheduleNotification('🍽️ Waktunya Makan Malam!', 'Rencanakan menu malam Anda', 18, 0);
    await this.notifService.scheduleNotification('🍪 Waktunya Cemilan!', 'Sa-nya ngemil?', 15, 0);
  }

  async openAddMenuModal() {
    const today = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
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
}