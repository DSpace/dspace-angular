import { Route } from '@angular/router';
import { ThemedExternalLoginPageComponent } from './themed-external-login-page.component';
import { RegistrationTokenGuard } from '../external-log-in/guards/registration-token.guard';
import { RegistrationDataResolver } from '../external-log-in/resolvers/registration-data.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ThemedExternalLoginPageComponent,
    canActivate: [RegistrationTokenGuard],
    resolve: { registrationData: RegistrationDataResolver },
  },
];
