import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';

import { ExternalLoginModule } from '../external-log-in/external-login.module';
import { ExternalLoginReviewAccountInfoRoutingModule } from './external-login-review-account-info-page-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ExternalLoginReviewAccountInfoRoutingModule,
    UiSwitchModule,
    ExternalLoginModule,
  ],
})
export class ExternalLoginReviewAccountInfoModule { }
