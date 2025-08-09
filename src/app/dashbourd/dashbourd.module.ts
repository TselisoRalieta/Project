import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashbourdPageRoutingModule } from './dashbourd-routing.module';

import { DashbourdPage } from './dashbourd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashbourdPageRoutingModule
  ],
  declarations: [DashbourdPage]
})
export class DashbourdPageModule {}
