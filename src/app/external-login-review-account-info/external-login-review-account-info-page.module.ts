import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalLoginReviewAccountInfoRoutingModule } from './external-login-review-account-info-page-routing.module';
import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';
import { CompareValuesPipe } from './helpers/compare-values.pipe';
import { ThemedExternalLoginReviewAccountInfoPageComponent } from './themed-external-login-review-account-info-page.component';
import { ReviewAccountInfoComponent } from './review-account-info/review-account-info.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from '../shared/shared.module';
import { ExternalLoginCompleteModule } from '../external-log-in-complete/external-login-complete.module';

@NgModule({
  declarations: [
    ExternalLoginReviewAccountInfoPageComponent,
    CompareValuesPipe,
    ThemedExternalLoginReviewAccountInfoPageComponent,
    ReviewAccountInfoComponent
  ],
  imports: [
    CommonModule,
    ExternalLoginReviewAccountInfoRoutingModule,
    SharedModule,
    UiSwitchModule,
    ExternalLoginCompleteModule
  ]
})
export class ExternalLoginReviewAccountInfoModule { }
