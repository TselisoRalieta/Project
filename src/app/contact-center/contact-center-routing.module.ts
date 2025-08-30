import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactCenterPage } from './contact-center.page';

const routes: Routes = [
  {
    path: '',
    component: ContactCenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactCenterPageRoutingModule {}
