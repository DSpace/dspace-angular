import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RegisterPageRoutingModule } from './register-page-routing.module';
import { RegisterEmailComponent } from './register-email/register-email.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { RegisterEmailFormModule } from '../register-email-form/register-email-form.module';
import { ProfilePageModule } from '../profile-page/profile-page.module';

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
    CreateProfileComponent
  ],
  providers: [],
  entryComponents: []
})

/**
 * Module related to components used to register a new user
 */
export class RegisterPageModule {

}
