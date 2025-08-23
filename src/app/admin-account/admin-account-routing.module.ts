import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminAccountPage } from './admin-account.page';

const routes: Routes = [
  {
    path: '',
    component: AdminAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAccountPageRoutingModule {}
