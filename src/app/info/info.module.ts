import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EndUserAgreementComponent } from './end-user-agreement/end-user-agreement.component';
import { InfoRoutingModule } from './info-routing.module';
import { EndUserAgreementContentComponent } from './end-user-agreement/end-user-agreement-content/end-user-agreement-content.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PrivacyContentComponent } from './privacy/privacy-content/privacy-content.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InfoRoutingModule
  ],
  declarations: [
    EndUserAgreementComponent,
    EndUserAgreementContentComponent,
    PrivacyComponent,
    PrivacyContentComponent
  ]
})
export class InfoModule {
}
