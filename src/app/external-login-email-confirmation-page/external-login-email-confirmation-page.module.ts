import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalLoginEmailConfirmationPageRoutingModule } from './external-login-email-confirmation-page-routing.module';
import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';
import { ExternalLoginCompleteModule } from '../external-log-in-complete/external-login-complete.module';


@NgModule({
  declarations: [
    ExternalLoginEmailConfirmationPageComponent
  ],
  imports: [
    CommonModule,
    ExternalLoginEmailConfirmationPageRoutingModule,
    ExternalLoginCompleteModule,
  ]
})
export class ExternalLoginEmailConfirmationPageModule { }
