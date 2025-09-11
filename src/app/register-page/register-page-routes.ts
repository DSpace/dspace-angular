import { Route } from '@angular/router';

import { ThemedCreateProfileComponent } from './create-profile/themed-create-profile.component';
import { ThemedRegisterEmailComponent } from './register-email/themed-register-email.component';
import { registrationGuard } from './registration.guard';
import { endUserAgreementCookieGuard } from '../info/end-user-agreement/end-user-agreement-cookie.guard'


export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedRegisterEmailComponent,
    data: { title: 'register-email.title' },
  },
  {
    path: ':token',
    component: ThemedCreateProfileComponent,
    canActivate: [
      registrationGuard,
      endUserAgreementCookieGuard,
    ],
  },
];
