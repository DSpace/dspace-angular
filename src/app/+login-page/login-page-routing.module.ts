import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page.component';
import {ShibbolethComponent} from './shibboleth/shibboleth.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', pathMatch: 'full',  component: LoginPageComponent, data: { title: 'login.title' } }
    /*  { path: 'shibboleth',   component: ShibbolethComponent }*/
    ])
  ]
})
export class LoginPageRoutingModule { }
