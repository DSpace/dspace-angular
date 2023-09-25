import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ExternalLoginEmailConfirmationPageRoutingModule
} from './external-login-email-confirmation-page-routing.module';
import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';
import { ExternalLoginModule } from '../external-log-in/external-login.module';


@NgModule({
  declarations: [
    ExternalLoginEmailConfirmationPageComponent
  ],
  imports: [
    CommonModule,
    ExternalLoginEmailConfirmationPageRoutingModule,
    ExternalLoginModule,
  ]
})
export class ExternalLoginEmailConfirmationPageModule { }
