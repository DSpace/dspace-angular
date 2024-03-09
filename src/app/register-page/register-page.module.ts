import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProfilePageModule } from '../profile-page/profile-page.module';
import { RegisterEmailFormModule } from '../register-email-form/register-email-form.module';
import { SharedModule } from '../shared/shared.module';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ThemedCreateProfileComponent } from './create-profile/themed-create-profile.component';
import { RegisterEmailComponent } from './register-email/register-email.component';
import { ThemedRegisterEmailComponent } from './register-email/themed-register-email.component';
import { RegisterPageRoutingModule } from './register-page-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RegisterPageRoutingModule,
    RegisterEmailFormModule,
    ProfilePageModule,
  ],
  declarations: [
    RegisterEmailComponent,
    ThemedRegisterEmailComponent,
    CreateProfileComponent,
    ThemedCreateProfileComponent,
  ],
  providers: [],
})

/**
 * Module related to components used to register a new user
 */
export class RegisterPageModule {

}
