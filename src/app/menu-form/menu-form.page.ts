import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MenuService } from '../services/menu';
import { Menu } from '../models/menu.model';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.page.html',
  styleUrls: ['./menu-form.page.scss'],
  standalone: false
})
export class MenuFormPage implements OnInit {
  isEdit = false;
  menuData?: Menu;
  
  namaMenu = '';
  selectedTanggal: string = '';
  selectedDateObj: Date = new Date();
  selectedKategori = '';
  catatan = '';

  showKategoriPicker: boolean = true;

  showCalendar: boolean = false;
  calendarDays: any[] = [];
  calendarMonth: string = '';
  calendarYear: number = 0;
  tempDate: Date = new Date();

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.menuData = this.navParams.get('menu');
    this.isEdit = this.navParams.get('isEdit') || false;
    const defaultTanggal = this.navParams.get('tanggal') || new Date();
    const defaultKategori = this.navParams.get('kategori');
    
    if (this.menuData) {
      this.namaMenu = this.menuData.nama;
      this.selectedTanggal = this.menuData.hari;
      this.selectedDateObj = new Date(this.menuData.hari);
      this.selectedKategori = this.menuData.kategori;
      this.catatan = this.menuData.catatan;
      this.showKategoriPicker = false; 
    } else if (defaultKategori) {
      
      this.selectedTanggal = this.formatDate(defaultTanggal);
      this.selectedDateObj = defaultTanggal;
      this.selectedKategori = defaultKategori;
      this.showKategoriPicker = false; 
    } else {
     
      this.selectedTanggal = this.formatDate(defaultTanggal);
      this.selectedDateObj = defaultTanggal;
      this.selectedKategori = 'Breakfast';
      this.showKategoriPicker = true; 
    }
  }

  formatDate(date: Date): string {
    const hariIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${hariIndo[date.getDay()]}, ${date.getDate()} ${bulanIndo[date.getMonth()]} ${date.getFullYear()}`;
  }

  openCalendar() {
    this.tempDate = new Date(this.selectedDateObj);
    this.updateCalendarDisplay();
    this.showCalendar = true;
  }

  closeCalendar() {
    this.showCalendar = false;
  }

  updateCalendarDisplay() {
    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    this.calendarMonth = bulanIndo[this.tempDate.getMonth()];
    this.calendarYear = this.tempDate.getFullYear();
    this.generateCalendarDays();
  }

  generateCalendarDays() {
    const year = this.tempDate.getFullYear();
    const month = this.tempDate.getMonth();
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
        const isSelected = this.isSameDate(date, this.tempDate);
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

  prevMonth() {
    this.tempDate.setMonth(this.tempDate.getMonth() - 1);
    this.updateCalendarDisplay();
  }

  nextMonth() {
    this.tempDate.setMonth(this.tempDate.getMonth() + 1);
    this.updateCalendarDisplay();
  }

  selectDate(day: any) {
    if (day.isEmpty) return;
    const selectedDate = new Date(this.tempDate.getFullYear(), this.tempDate.getMonth(), day.date);
    this.selectedDateObj = selectedDate;
    this.selectedTanggal = this.formatDate(selectedDate);
    this.showCalendar = false;
  }

  simpan() {
    if (!this.namaMenu) return;
    
    if (this.isEdit && this.menuData) {
      const updatedMenu: Menu = {
        ...this.menuData,
        nama: this.namaMenu,
        hari: this.selectedTanggal,
        kategori: this.selectedKategori,
        catatan: this.catatan
      };
      this.menuService.updateMenu(updatedMenu);
    } else {
      const newMenu: Menu = {
        id: Date.now().toString(),
        nama: this.namaMenu,
        hari: this.selectedTanggal,
        kategori: this.selectedKategori,
        catatan: this.catatan || '-',
        sudahDimasak: false
      };
      this.menuService.addMenu(newMenu);
    }
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}