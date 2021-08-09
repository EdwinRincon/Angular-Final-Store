import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePwdComponent } from './components/change-pwd/change-pwd.component';

import { LoginComponent } from './components/login/login.component';
import { ForgotPwdComponent } from './components/forgot-pwd/forgot-pwd.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot',
    component: ForgotPwdComponent
  },
  {
    path: 'resetPwd',
    component: ChangePwdComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
