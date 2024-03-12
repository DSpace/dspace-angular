import { Route } from '@angular/router';

import { ItemPageResolver } from '../item-page/item-page.resolver';
import { RegistrationGuard } from '../register-page/registration.guard';
import { ThemedForgotEmailComponent } from './forgot-password-email/themed-forgot-email.component';
import { ThemedForgotPasswordFormComponent } from './forgot-password-form/themed-forgot-password-form.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedForgotEmailComponent,
    data: { title: 'forgot-password.title' },
    providers: [
      ItemPageResolver,
    ],
  },
  {
    path: ':token',
    component: ThemedForgotPasswordFormComponent,
    canActivate: [RegistrationGuard],
    providers: [
      ItemPageResolver,
    ],
  },
];
