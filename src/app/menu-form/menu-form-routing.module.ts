import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuFormPage } from './menu-form.page';

const routes: Routes = [
  {
    path: '',
    component: MenuFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuFormPageRoutingModule {}
