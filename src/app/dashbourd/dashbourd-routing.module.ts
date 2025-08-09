import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashbourdPage } from './dashbourd.page';

const routes: Routes = [
  {
    path: '',
    component: DashbourdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashbourdPageRoutingModule {}
