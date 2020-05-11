import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterEmailComponent } from './register-email/register-email.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { RegistrationResolver } from './registration.resolver';
import { ItemPageResolver } from '../+item-page/item-page.resolver';

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
 * This module defines the default component to load when navigating to the mydspace page path.
 */
export class RegisterPageRoutingModule {
}
