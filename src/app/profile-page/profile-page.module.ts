import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageComponent } from './profile-page.component';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';
import { ProfilePageResearcherFormComponent } from './profile-page-researcher-form/profile-page-researcher-form.component';
import { ThemedProfilePageComponent } from './themed-profile-page.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { OpenaireModule } from '../openaire/openaire.module';

@NgModule({
  imports: [
    ProfilePageRoutingModule,
    CommonModule,
    SharedModule,
    UiSwitchModule,
    OpenaireModule
  ],
  exports: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    ProfilePageResearcherFormComponent
  ],
  declarations: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    ProfilePageResearcherFormComponent
  ]
})
export class ProfilePageModule {

}
