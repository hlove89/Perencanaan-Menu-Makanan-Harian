import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { MenuService } from '../services/menu';
import { Menu } from '../models/menu.model';
import { MenuFormPage } from '../menu-form/menu-form.page';
import { AlertController } from '@ionic/angular';
import { App } from '@capacitor/app'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  
  currentDate: Date = new Date();
  currentDay: number = 0;
  currentMonth: string = '';
  currentYear: number = 0;
  currentMonthIndex: number = 0;
  
  weekDays: any[] = [];
  weekDaysShort: any[] = [];
  selectedDayIndex: number = 0;
  selectedDate: Date = new Date();
  
  formattedSelectedDate: string = '';

  showMonthPicker: boolean = false;
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  years: number[] = [];

  showPopup: boolean = false;

  private lastBackPress = 0;
  private timePeriodToExit = 2000; 

  constructor(
    private router: Router,
    private menuService: MenuService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private platform: Platform,         
    private toastCtrl: ToastController   
  ) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  ngOnInit() {
    this.loadCurrentDate();
    
    const popupShown = sessionStorage.getItem('welcome_popup_shown');
    if (!popupShown) {
      setTimeout(() => {
        this.showPopup = true;
        sessionStorage.setItem('welcome_popup_shown', 'true');
      }, 500);
    }
  }

  ionViewDidEnter() {
    this.refreshMenus();
    
    this.platform.backButton.subscribeWithPriority(10, () => {
      const currentTime = new Date().getTime();
      
      if (currentTime - this.lastBackPress < this.timePeriodToExit) {
        App.exitApp(); 
      } else {
        this.tampilkanToastKonfirmasi();
        this.lastBackPress = currentTime; 
      }
    });
  }

  async tampilkanToastKonfirmasi() {
    const toast = await this.toastCtrl.create({
      message: 'Ketuk sekali lagi untuk keluar',
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  hidePopup() {
    this.showPopup = false;
  }

  loadCurrentDate() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  refreshMenus() {
    this.updateFormattedDate(); 
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  updateDisplay() {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    this.currentMonth = monthNames[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthIndex = this.currentDate.getMonth();
    this.currentDay = this.currentDate.getDate();
    this.updateFormattedDate(); 
  }

  updateFormattedDate() {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    this.formattedSelectedDate = `${dayNames[this.selectedDate.getDay()]}, ${this.selectedDate.getDate()} ${monthNames[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;
  }

  generateWeekDays() {
    const today = new Date(this.selectedDate);
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const dayNames = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
    this.weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        name: dayNames[i],
        date: date.getDate(),
        fullDate: date,
        isToday: this.isToday(date),
        isSelected: this.isSameDate(date, this.selectedDate)
      });
    }
    
    this.selectedDayIndex = this.weekDays.findIndex(day => day.isSelected);
  }

  generateWeekDaysShort() {
    const startOfWeek = new Date(this.selectedDate);
    const day = this.selectedDate.getDay();
    const diff = this.selectedDate.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    this.weekDaysShort = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDaysShort.push({
        name: dayNames[i],
        date: date.getDate(),
        fullDate: date
      });
    }
  }

  isSelectedDay(index: number): boolean {
    if (!this.weekDaysShort[index]) return false;
    return this.selectedDate.getDate() === this.weekDaysShort[index].date &&
           this.selectedDate.getMonth() === this.weekDaysShort[index].fullDate.getMonth() &&
           this.selectedDate.getFullYear() === this.weekDaysShort[index].fullDate.getFullYear();
  }

  selectDayByIndex(index: number) {
    if (this.weekDaysShort[index]) {
      this.selectedDate = new Date(this.weekDaysShort[index].fullDate);
      this.currentDate = new Date(this.selectedDate);
      this.updateDisplay();
      this.generateWeekDays();
      this.generateWeekDaysShort();
    }
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToToday() {
    this.selectedDate = new Date();
    this.currentDate = new Date();
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  getDayNumber(): string {
    return this.selectedDate.getDate().toString();
  }

  getShortDayName(): string {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return dayNames[this.selectedDate.getDay()];
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

  prevDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    this.currentDate = new Date(this.selectedDate);
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  nextDay() {
    this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    this.currentDate = new Date(this.selectedDate);
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  selectDay(index: number) {
    this.selectedDate = new Date(this.weekDays[index].fullDate);
    this.currentDate = new Date(this.selectedDate);
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  openMonthPicker() {
    this.showMonthPicker = true;
  }

  closeMonthPicker() {
    this.showMonthPicker = false;
  }

  selectMonth(monthIndex: number) {
    this.currentDate.setMonth(monthIndex);
    const newDate = new Date(this.currentDate.getFullYear(), monthIndex, this.selectedDate.getDate());
    if (newDate.getMonth() !== monthIndex) {
      this.selectedDate = new Date(this.currentDate.getFullYear(), monthIndex + 1, 0);
    } else {
      this.selectedDate = newDate;
    }
    this.currentDate = new Date(this.selectedDate);
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  selectYear(year: number) {
    const newDate = new Date(year, this.selectedDate.getMonth(), this.selectedDate.getDate());
    if (newDate.getMonth() !== this.selectedDate.getMonth()) {
      this.selectedDate = new Date(year, this.selectedDate.getMonth() + 1, 0);
    } else {
      this.selectedDate = newDate;
    }
    this.currentDate = new Date(this.selectedDate);
    this.updateDisplay();
    this.generateWeekDays();
    this.generateWeekDaysShort();
  }

  getFormattedDate(): string {
    return this.formattedSelectedDate;
  }

  getMenusByKategori(kategori: string): Menu[] {
    const allMenus = this.menuService.getMenus();
    return allMenus.filter(m => m.kategori === kategori && m.hari === this.formattedSelectedDate);
  }

  async tambahMenu(kategori: string) {
    const modal = await this.modalCtrl.create({
      component: MenuFormPage,
      componentProps: { 
        hari: this.formattedSelectedDate,
        kategori: kategori
      }
    });
    modal.onDidDismiss().then(() => this.refreshMenus());
    await modal.present();
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
    modal.onDidDismiss().then(() => this.refreshMenus());
  }

  async lihatDetailMenu(menu: Menu) {
    const alert = await this.alertCtrl.create({
      header: menu.nama,
      subHeader: menu.kategori === 'Breakfast' ? '🍳 Sarapan' :
                 menu.kategori === 'Lunch' ? '🍲 Makan Siang' :
                 menu.kategori === 'Dinner' ? '🍽️ Makan Malam' : '🍪 Cemilan',
      message: `
        📅 ${menu.hari}
        📝 Catatan: ${menu.catatan || 'Tidak ada catatan'}
        ${menu.sudahDimasak ? '✅ Sudah dimasak' : '⭕ Belum dimasak'}
      `,
      buttons: ['Tutup']
    });
    await alert.present();
  }

  toggleMasak(id: string) {
    this.menuService.toggleSudahDimasak(id);
    this.refreshMenus();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToMenu() {
    this.router.navigate(['/daftar-menu']);
  }
}