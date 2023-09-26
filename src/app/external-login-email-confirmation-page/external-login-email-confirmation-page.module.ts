import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalLoginEmailConfirmationPageRoutingModule } from './external-login-email-confirmation-page-routing.module';
import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ExternalLoginEmailConfirmationPageComponent
  ],
  imports: [
    CommonModule,
    ExternalLoginEmailConfirmationPageRoutingModule,
    SharedModule
  ]
})
export class ExternalLoginEmailConfirmationPageModule { }
