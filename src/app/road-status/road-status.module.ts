import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadStatusPageRoutingModule } from './road-status-routing.module';

import { RoadStatusPage } from './road-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadStatusPageRoutingModule
  ],
  declarations: [RoadStatusPage]
})
export class RoadStatusPageModule {}
