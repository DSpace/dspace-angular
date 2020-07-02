import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ForgotEmailComponent } from './forgot-password-email/forgot-email.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { RegisterEmailFormModule } from '../register-email-form/register-email-form.module';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';
import { ProfilePageModule } from '../profile-page/profile-page.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ForgotPasswordRoutingModule,
    RegisterEmailFormModule,
    ProfilePageModule,
  ],
  declarations: [
    ForgotEmailComponent,
    ForgotPasswordFormComponent
  ],
  providers: [],
  entryComponents: []
})

/**
 * Module related to the Forgot Password components
 */
export class ForgotPasswordModule {

}
