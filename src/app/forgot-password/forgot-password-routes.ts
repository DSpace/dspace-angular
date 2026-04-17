import { Route } from '@angular/router';

import { registrationGuard } from '../register-page/registration.guard';
import { ThemedForgotEmailComponent } from './forgot-password-email/themed-forgot-email.component';
import { ThemedForgotPasswordFormComponent } from './forgot-password-form/themed-forgot-password-form.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedForgotEmailComponent,
    data: { title: 'forgot-password.title' },
  },
  {
    path: ':token',
    component: ThemedForgotPasswordFormComponent,
    canActivate: [registrationGuard],
  },
];
