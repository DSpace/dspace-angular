import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from './login-page-routing.module';
import {ShibbolethComponent} from './shibboleth/shibboleth.component';

@NgModule({
  imports: [
    LoginPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    LoginPageComponent,
   /* ShibbolethComponent*/
  ]
})
export class LoginPageModule {

}
