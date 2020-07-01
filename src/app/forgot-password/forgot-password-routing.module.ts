import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemPageResolver } from '../+item-page/item-page.resolver';
import { RegistrationResolver } from '../register-email-form/registration.resolver';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';
import { ForgotEmailComponent } from './forgot-password-email/forgot-email.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ForgotEmailComponent,
        data: {title: 'forgot-password.title'},
      },
      {
        path: ':token',
        component: ForgotPasswordFormComponent,
        resolve: {registration: RegistrationResolver}
      }
    ])
  ],
  providers: [
    RegistrationResolver,
    ItemPageResolver
  ]
})
/**
 * This module defines the routing to the components related to the forgot password components.
 */
export class ForgotPasswordRoutingModule {
}
