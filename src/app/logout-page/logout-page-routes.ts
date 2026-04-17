import { Route } from '@angular/router';

import { authenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedLogoutPageComponent } from './themed-logout-page.component';

export const ROUTES: Route[] = [
  {
    canActivate: [authenticatedGuard],
    path: '',
    component: ThemedLogoutPageComponent,
    data: { title: 'logout.title' },
  },
];
