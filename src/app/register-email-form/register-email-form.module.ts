import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RegisterEmailFormComponent } from './register-email-form.component';
import { GoogleRecaptchaModule } from '../core/google-recaptcha/google-recaptcha.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GoogleRecaptchaModule
  ],
  declarations: [
    RegisterEmailFormComponent,
  ],
  providers: [],
  exports: [
    RegisterEmailFormComponent,
  ]
})

/**
 * The module that contains the components related to the email registration
 */
export class RegisterEmailFormModule {

}
