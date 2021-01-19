import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotPwdComponent } from './components/forgot-pwd/forgot-pwd.component';

import { MaterialModule } from '@material/material.module';
import { SharedModule } from '@shared/shared.module';
import { ChangePwdComponent } from './components/change-pwd/change-pwd.component';


@NgModule({
  declarations: [LoginComponent, ForgotPwdComponent, ChangePwdComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
