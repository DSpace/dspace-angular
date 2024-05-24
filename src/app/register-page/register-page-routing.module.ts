import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemedCreateProfileComponent } from './create-profile/themed-create-profile.component';
import { ThemedRegisterEmailComponent } from './register-email/themed-register-email.component';
import { RegistrationGuard } from './registration.guard';
import { RegistrationResolver } from '../register-email-form/registration.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedRegisterEmailComponent,
        data: { title: 'register-email.title' },
      },
      {
        path: ':token',
        component: ThemedCreateProfileComponent,
        resolve: {registration: RegistrationResolver},
        canActivate: [
          RegistrationGuard
        ],
      },
    ]),
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
