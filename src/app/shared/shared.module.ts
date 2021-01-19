import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ExponentialPipe } from './pipes/exponential/exponential.pipe';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@material/material.module';
import { CartRepeatPipe } from './pipes/cart-repeat.pipe';

import { QuicklinkModule } from 'ngx-quicklink';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';



@NgModule({
  declarations: [
    ExponentialPipe,
    HeaderComponent,
    FooterComponent,
    CartRepeatPipe,
    LoadingSpinnerComponent
  ],
  exports: [
    ExponentialPipe,
    HeaderComponent,
    FooterComponent,
    CartRepeatPipe,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    QuicklinkModule
  ]
})
export class SharedModule { }
