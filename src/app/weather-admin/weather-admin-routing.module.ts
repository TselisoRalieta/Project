import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherAdminPage } from './weather-admin.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherAdminPageRoutingModule {}
