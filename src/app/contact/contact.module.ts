import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactComponent } from './components/contact/contact.component';

import { ContactRoutingModule } from './contact-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
declarations: [
    ContactComponent,
],
imports: [
    CommonModule,
    SharedModule,
    ContactRoutingModule,
    MaterialModule,
    ReactiveFormsModule
]
})
export class ContactModule {

}
