import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallCenterPageRoutingModule } from './call-center-routing.module';

import { CallCenterPage } from './call-center.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallCenterPageRoutingModule
  ],
  declarations: [CallCenterPage]
})
export class CallCenterPageModule {}
