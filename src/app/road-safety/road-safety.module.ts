import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadSafetyPageRoutingModule } from './road-safety-routing.module';

import { RoadSafetyPage } from './road-safety.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadSafetyPageRoutingModule
  ],
  declarations: [RoadSafetyPage]
})
export class RoadSafetyPageModule {}
