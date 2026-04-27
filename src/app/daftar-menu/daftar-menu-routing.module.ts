import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaftarMenuPage } from './daftar-menu.page';

const routes: Routes = [
  {
    path: '',
    component: DaftarMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaftarMenuPageRoutingModule {}
