import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from './login-page-routing.module';
import { ThemedLoginPageComponent } from './themed-login-page.component';
import { AuthFailedPageComponent } from './auth-failed-page/auth-failed-page.component';
import { MissingIdpHeadersComponent } from './missing-idp-headers/missing-idp-headers.component';
import { AutoregistrationComponent } from './autoregistration/autoregistration.component';

@NgModule({
  imports: [
    LoginPageRoutingModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    LoginPageComponent,
    ThemedLoginPageComponent,
    AuthFailedPageComponent,
    MissingIdpHeadersComponent,
    AutoregistrationComponent
  ]
})
export class LoginPageModule {

}
