import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminHazardPageRoutingModule } from './admin-hazard-routing.module';

import { AdminHazardPage } from './admin-hazard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminHazardPageRoutingModule
  ],
  declarations: [AdminHazardPage]
})
export class AdminHazardPageModule {}
