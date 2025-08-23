import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAccountPageRoutingModule } from './admin-account-routing.module';

import { AdminAccountPage } from './admin-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminAccountPageRoutingModule
  ],
  declarations: [AdminAccountPage]
})
export class AdminAccountPageModule {}
