import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHazardPage } from './admin-hazard.page';

const routes: Routes = [
  {
    path: '',
    component: AdminHazardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminHazardPageRoutingModule {}
