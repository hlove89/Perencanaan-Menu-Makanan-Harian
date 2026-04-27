import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'daftar-menu',
    loadChildren: () => import('./daftar-menu/daftar-menu.module').then( m => m.DaftarMenuPageModule)
  },
  {
    path: 'menu-form',
    loadChildren: () => import('./menu-form/menu-form.module').then( m => m.MenuFormPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
