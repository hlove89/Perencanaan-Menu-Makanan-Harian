export interface Menu {
  id: string;
  nama: string;
  hari: string;
  kategori: string;    // Breakfast, Lunch, Dinner, Snack
  catatan: string;
  sudahDimasak: boolean;
}

export const DAFTAR_HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const KATEGORI_MENU = [
  { value: 'Breakfast', icon: '🍳', label: 'Sarapan' },
  { value: 'Lunch', icon: '🍲', label: 'Makan Siang' },
  { value: 'Dinner', icon: '🍽️', label: 'Makan Malam' },
  { value: 'Snack', icon: '🍪', label: 'Cemilan' }
];