import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from './login-page-routing.module';

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
