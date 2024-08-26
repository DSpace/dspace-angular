import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';

import { ExternalLoginModule } from '../external-log-in/external-login.module';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';
import { ExternalLoginReviewAccountInfoRoutingModule } from './external-login-review-account-info-page-routing.module';
import { CompareValuesPipe } from './helpers/compare-values.pipe';
import { ReviewAccountInfoComponent } from './review-account-info/review-account-info.component';
import { ThemedExternalLoginReviewAccountInfoPageComponent } from './themed-external-login-review-account-info-page.component';

@NgModule({
  declarations: [
    ExternalLoginReviewAccountInfoPageComponent,
    CompareValuesPipe,
    ThemedExternalLoginReviewAccountInfoPageComponent,
    ReviewAccountInfoComponent,
  ],
  imports: [
    CommonModule,
    ExternalLoginReviewAccountInfoRoutingModule,
    UiSwitchModule,
    ExternalLoginModule,
  ],
})
export class ExternalLoginReviewAccountInfoModule { }
