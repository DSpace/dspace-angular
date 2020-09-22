import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterEmailComponent } from './register-email/register-email.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ItemPageResolver } from '../+item-page/item-page.resolver';
import { RegistrationResolver } from '../register-email-form/registration.resolver';
import { EndUserAgreementCookieGuard } from '../core/end-user-agreement/end-user-agreement-cookie.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: RegisterEmailComponent,
        data: {title: 'register-email.title'},
      },
      {
        path: ':token',
        component: CreateProfileComponent,
        resolve: {registration: RegistrationResolver},
        canActivate: [EndUserAgreementCookieGuard]
      }
    ])
  ],
  providers: [
    RegistrationResolver,
    ItemPageResolver
  ]
})
/**
 * Module related to the navigation to components used to register a new user
 */
export class RegisterPageRoutingModule {
}
