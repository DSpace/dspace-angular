import { Routes } from '@angular/router';

import { ExternalLoginEmailConfirmationPageComponent } from './external-login-email-confirmation-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ExternalLoginEmailConfirmationPageComponent,
  },
];
