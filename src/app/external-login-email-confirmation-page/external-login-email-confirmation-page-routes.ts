import { Route } from '@angular/router';

import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ExternalLoginEmailConfirmationPageComponent,
  },
];
