import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadStatusPage } from './road-status.page';

const routes: Routes = [
  {
    path: '',
    component: RoadStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadStatusPageRoutingModule {}
