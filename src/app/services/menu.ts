import { Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private storageKey = 'meal_planner_data';

  constructor() {}

  getMenus(): Menu[] {
    const menus = localStorage.getItem(this.storageKey);
    if (menus) {
      return JSON.parse(menus);
    }
    return this.getDefaultMenus();
  }

  private getDefaultMenus(): Menu[] {
    return [
      { id: '1', nama: 'Nasi Goreng', hari: 'Senin', kategori: 'Breakfast', catatan: 'Telur, kecap, bawang', sudahDimasak: true },
      { id: '2', nama: 'Bubur Ayam', hari: 'Senin', kategori: 'Breakfast', catatan: 'Cakwe, kacang, suwiran ayam', sudahDimasak: false },
      { id: '3', nama: 'Ayam Bakar', hari: 'Senin', kategori: 'Lunch', catatan: 'Sambal terasi, lalapan', sudahDimasak: false },
      { id: '4', nama: 'Soto Ayam', hari: 'Senin', kategori: 'Dinner', catatan: 'Bawang goreng, emping', sudahDimasak: false },
      { id: '5', nama: 'Pisang Goreng', hari: 'Senin', kategori: 'Snack', catatan: 'Keju, meses', sudahDimasak: false },
    ];
  }

  saveMenus(menus: Menu[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(menus));
  }

  addMenu(menu: Menu): void {
    const menus = this.getMenus();
    menus.push(menu);
    this.saveMenus(menus);
  }

  updateMenu(updatedMenu: Menu): void {
    let menus = this.getMenus();
    menus = menus.map(m => m.id === updatedMenu.id ? updatedMenu : m);
    this.saveMenus(menus);
  }

  deleteMenu(id: string): void {
    let menus = this.getMenus();
    menus = menus.filter(m => m.id !== id);
    this.saveMenus(menus);
  }

  toggleSudahDimasak(id: string): void {
    const menus = this.getMenus();
    const menu = menus.find(m => m.id === id);
    if (menu) {
      menu.sudahDimasak = !menu.sudahDimasak;
      this.saveMenus(menus);
      console.log('Menu toggled:', menu.nama, 'sekarang:', menu.sudahDimasak);
    }
  }
}