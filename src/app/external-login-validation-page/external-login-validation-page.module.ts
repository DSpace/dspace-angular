import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalLoginValidationPageRoutingModule } from './external-login-validation-page-routing.module';
import { ExternalLoginValidationPageComponent } from './external-login-validation-page.component';
import { ThemedExternalLoginValidationPageComponent } from './themed-external-login-validation-page.component';

import { EmailValidatedComponent } from './email-validated/email-validated.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ExternalLoginValidationPageComponent,
    ThemedExternalLoginValidationPageComponent,
    EmailValidatedComponent,
  ],
  imports: [
    CommonModule,
    ExternalLoginValidationPageRoutingModule,
    SharedModule
  ]
})
export class ExternalLoginValidationPageModule { }
