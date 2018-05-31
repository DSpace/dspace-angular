import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full',  component: LoginPageComponent, data: { title: 'login.title' } }
    ])
  ]
})
export class LoginPageRoutingModule { }
