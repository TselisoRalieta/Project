import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadSafetyPage } from './road-safety.page';

const routes: Routes = [
  {
    path: '',
    component: RoadSafetyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadSafetyPageRoutingModule {}
