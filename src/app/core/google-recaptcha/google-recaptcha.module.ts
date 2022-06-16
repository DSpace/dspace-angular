import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { GoogleRecaptchaService } from './google-recaptcha.service';

const PROVIDERS = [
    GoogleRecaptchaService
];

@NgModule({
  imports: [ SharedModule ],
  providers: [
    ...PROVIDERS
  ]
})

/**
 * This module handles google recaptcha functionalities
 */
export class GoogleRecaptchaModule {}
