import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalLoginValidationPageRoutingModule } from './external-login-validation-page-routing.module';
import { ExternalLoginValidationPageComponent } from './external-login-validation-page.component';
import { ThemedExternalLoginValidationPageComponent } from './themed-external-login-validation-page.component';

import { UiSwitchModule } from 'ngx-ui-switch';
import { ReviewAccountInfoComponent } from './review-account-info/review-account-info.component';
import { EmailValidatedComponent } from './email-validated/email-validated.component';
import { SharedModule } from '../shared/shared.module';
import { CompareValuesPipe } from './helpers/compare-values.pipe';


@NgModule({
  declarations: [
    ExternalLoginValidationPageComponent,
    ThemedExternalLoginValidationPageComponent,
    ReviewAccountInfoComponent,
    EmailValidatedComponent,
    CompareValuesPipe
  ],
  imports: [
    CommonModule,
    ExternalLoginValidationPageRoutingModule,
    SharedModule,
    UiSwitchModule,
  ]
})
export class ExternalLoginValidationPageModule { }
