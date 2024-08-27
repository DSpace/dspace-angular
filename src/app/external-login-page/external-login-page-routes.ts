import { Route } from '@angular/router';

import { RegistrationTokenGuard } from '../external-log-in/guards/registration-token.guard';
import { RegistrationDataResolver } from '../external-log-in/resolvers/registration-data.resolver';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginPageComponent,
    canActivate: [RegistrationTokenGuard],
    resolve: { registrationData: RegistrationDataResolver },
  },
];
