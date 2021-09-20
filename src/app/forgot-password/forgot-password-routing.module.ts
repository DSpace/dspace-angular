import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemPageResolver } from '../item-page/item-page.resolver';
import { RegistrationResolver } from '../register-email-form/registration.resolver';
import { ThemedForgotPasswordFormComponent } from './forgot-password-form/themed-forgot-password-form.component';
import { ThemedForgotEmailComponent } from './forgot-password-email/themed-forgot-email.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedForgotEmailComponent,
        data: {title: 'forgot-password.title'},
      },
      {
        path: ':token',
        component: ThemedForgotPasswordFormComponent,
        resolve: {registration: RegistrationResolver}
      }
    ])
  ],
  providers: [
    RegistrationResolver,
    ItemPageResolver,
  ]
})
/**
 * This module defines the routing to the components related to the forgot password components.
 */
export class ForgotPasswordRoutingModule {
}
