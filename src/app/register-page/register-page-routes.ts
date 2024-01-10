import { ThemedRegisterEmailComponent } from './register-email/themed-register-email.component';
import { ItemPageResolver } from '../item-page/item-page.resolver';
import { EndUserAgreementCookieGuard } from '../core/end-user-agreement/end-user-agreement-cookie.guard';
import { ThemedCreateProfileComponent } from './create-profile/themed-create-profile.component';
import { RegistrationGuard } from './registration.guard';
import { Route } from '@angular/router';


export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedRegisterEmailComponent,
    providers: [
      ItemPageResolver
    ],
    data: {title: 'register-email.title'},
  },
  {
    path: ':token',
    component: ThemedCreateProfileComponent,
    providers: [
      ItemPageResolver
    ],
    canActivate: [
      RegistrationGuard,
      EndUserAgreementCookieGuard,
    ],
  }
];
