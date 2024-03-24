import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedLogoutPageComponent } from './themed-logout-page.component';

export const ROUTES: Route[] = [
  {
    canActivate: [AuthenticatedGuard],
    path: '',
    component: ThemedLogoutPageComponent,
    data: { title: 'logout.title' },
  },
];
