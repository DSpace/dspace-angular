import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    LoginPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    LoginPageComponent
  ]
})
export class LoginPageModule {

}
