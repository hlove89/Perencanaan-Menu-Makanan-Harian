import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { MenuService } from '../services/menu';
import { Menu, KATEGORI_MENU } from '../models/menu.model';
import { MenuFormPage } from '../menu-form/menu-form.page';

@Component({
  selector: 'app-daftar-menu',
  templateUrl: './daftar-menu.page.html',
  styleUrls: ['./daftar-menu.page.scss'],
  standalone: false
})
export class DaftarMenuPage {
  
  currentDate: Date = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  calendarDays: any[] = [];
  selectedDate: Date = new Date();
  selectedFullDate: string = '';
  
  tempMonth: number = 0;
  tempYear: number = 0;
  
  filteredMenus: Menu[] = [];
  
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  showMonthPicker: boolean = false;

  constructor(
    private menuService: MenuService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.loadCurrentDate();
  }

  loadCurrentDate() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.updateCalendar();
    this.loadMenus();
  }

  updateCalendar() {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    this.currentMonth = monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
    
    this.generateCalendarDays();
    this.updateSelectedFullDate();
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    this.calendarDays = [];
    let currentDay = 1;
    
    for (let i = 0; i < 42; i++) {
      if (i < startDayOfWeek || currentDay > daysInMonth) {
        this.calendarDays.push({ date: '', isEmpty: true });
      } else {
        const date = new Date(year, month, currentDay);
        const isToday = this.isToday(date);
        const isSelected = this.isSameDate(date, this.selectedDate);
        this.calendarDays.push({
          date: currentDay,
          fullDate: date,
          isToday: isToday,
          isSelected: isSelected,
          isEmpty: false
        });
        currentDay++;
      }
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  selectDate(day: any) {
    if (day.isEmpty) return;
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day.date);
    this.updateSelectedFullDate();
    this.generateCalendarDays();
    this.loadMenus();
  }

  updateSelectedFullDate() {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    this.selectedFullDate = `${dayNames[this.selectedDate.getDay()]}, ${this.selectedDate.getDate()} ${monthNames[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
    this.loadMenus();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
    this.loadMenus();
  }

  prevDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.updateSelectedFullDate();
    this.generateCalendarDays();
    this.loadMenus();
  }

  nextDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.updateSelectedFullDate();
    this.generateCalendarDays();
    this.loadMenus();
  }

  openMonthPicker() {
    this.tempMonth = this.currentDate.getMonth();
    this.tempYear = this.currentDate.getFullYear();
    this.showMonthPicker = true;
  }

  closeMonthPicker() {
    this.showMonthPicker = false;
  }

  selectMonthTemp(monthIndex: number) {
    this.tempMonth = monthIndex;
  }

  changeYear(delta: number) {
    this.tempYear += delta;
  }

  applyMonthYear() {
    this.currentDate.setMonth(this.tempMonth);
    this.currentDate.setFullYear(this.tempYear);
    this.updateCalendar();
    this.loadMenus();
    this.closeMonthPicker();
  }

  loadMenus() {
    const allMenus = this.menuService.getMenus();
    this.filteredMenus = allMenus.filter(m => m.hari === this.selectedFullDate);
  }

  getKategoriLabel(kategori: string): string {
  const kat = KATEGORI_MENU.find(k => k.value === kategori);
  if (kat) {
    return `${kat.icon} ${kat.label}`;
  }
  return kategori;
  }

  async tambahMenu() {
    const modal = await this.modalCtrl.create({
      component: MenuFormPage,
      componentProps: { hari: this.selectedFullDate }
    });
    modal.onDidDismiss().then(() => this.loadMenus());
    await modal.present();
  }

  async editMenu(menu: Menu) {
    const modal = await this.modalCtrl.create({
      component: MenuFormPage,
      componentProps: { menu, isEdit: true }
    });
    modal.onDidDismiss().then(() => this.loadMenus());
    await modal.present();
  }

  toggleMasak(id: string) {
    this.menuService.toggleSudahDimasak(id);
    this.loadMenus();
  }

  async tambahMenuCepat() {
    const today = new Date();
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formattedDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    
    const modal = await this.modalCtrl.create({
      component: MenuFormPage,
      componentProps: { 
        hari: formattedDate,
        kategori: 'Breakfast'
      }
    });
    await modal.present();
    modal.onDidDismiss().then(() => this.loadMenus());
  }

  async hapusMenu(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Menu',
      message: 'Apakah Anda yakin ingin menghapus menu ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        { text: 'Hapus', handler: () => {
          this.menuService.deleteMenu(id);
          this.loadMenus();
        }}
      ]
    });
    await alert.present();
  }
}