import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactCenterPageRoutingModule } from './contact-center-routing.module';

import { ContactCenterPage } from './contact-center.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactCenterPageRoutingModule
  ],
  declarations: [ContactCenterPage]
})
export class ContactCenterPageModule {}
