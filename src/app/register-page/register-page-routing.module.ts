import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemedRegisterEmailComponent } from './register-email/themed-register-email.component';
import { RegistrationResolver } from '../register-email-form/registration.resolver';
import { ThemedCreateProfileComponent } from './create-profile/themed-create-profile.component';
import { RegistrationGuard } from './registration.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedRegisterEmailComponent,
        data: {title: 'register-email.title'},
      },
      {
        path: ':token',
        component: ThemedCreateProfileComponent,
        resolve: {registration: RegistrationResolver},
        canActivate: [
          RegistrationGuard
        ],
      }
    ])
  ],
  providers: [
    RegistrationResolver,
  ]
})
/**
 * Module related to the navigation to components used to register a new user
 */
export class RegisterPageRoutingModule {
}
