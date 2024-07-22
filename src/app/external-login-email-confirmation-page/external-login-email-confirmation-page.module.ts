import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExternalLoginModule } from '../external-log-in/external-login.module';
import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';
import { ExternalLoginEmailConfirmationPageRoutingModule } from './external-login-email-confirmation-page-routing.module';


@NgModule({
  declarations: [
    ExternalLoginEmailConfirmationPageComponent,
  ],
  imports: [
    CommonModule,
    ExternalLoginEmailConfirmationPageRoutingModule,
    ExternalLoginModule,
  ],
})
export class ExternalLoginEmailConfirmationPageModule { }
