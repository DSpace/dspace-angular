import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageComponent } from './profile-page.component';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';
import { ThemedProfilePageComponent } from './themed-profile-page.component';

@NgModule({
  imports: [
    ProfilePageRoutingModule,
    CommonModule,
    SharedModule
  ],
  exports: [
    ProfilePageSecurityFormComponent,
    ProfilePageMetadataFormComponent
  ],
  declarations: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent
  ]
})
export class ProfilePageModule {

}
