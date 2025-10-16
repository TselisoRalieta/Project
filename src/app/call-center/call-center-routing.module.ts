import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallCenterPage } from './call-center.page';

const routes: Routes = [
  {
    path: '',
    component: CallCenterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallCenterPageRoutingModule {}
