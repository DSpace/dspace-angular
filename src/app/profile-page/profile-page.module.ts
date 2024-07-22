import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';

import { NotificationsModule } from '../notifications/notifications.module';
import { FormModule } from '../shared/form/form.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileClaimItemModalComponent } from './profile-claim-item-modal/profile-claim-item-modal.component';
import { ProfilePageComponent } from './profile-page.component';
import { ProfilePageAccessTokenComponent } from './profile-page-access-token/profile-page-access-token.component';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageResearcherFormComponent } from './profile-page-researcher-form/profile-page-researcher-form.component';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';
import { ThemedProfilePageComponent } from './themed-profile-page.component';


@NgModule({
  imports: [
    ProfilePageRoutingModule,
    CommonModule,
    SharedModule,
    FormModule,
    UiSwitchModule,
    NotificationsModule,
  ],
  exports: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    ProfilePageResearcherFormComponent,
    ProfilePageAccessTokenComponent,
  ],
  declarations: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfileClaimItemModalComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    ProfilePageResearcherFormComponent,
    ProfilePageAccessTokenComponent,
  ],
})
export class ProfilePageModule {

}
