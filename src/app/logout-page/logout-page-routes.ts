import { Route } from '@angular/router';

import { authenticatedGuard } from '../../../modules/core/src/lib/core/auth/authenticated.guard';
import { ThemedLogoutPageComponent } from './themed-logout-page.component';

export const ROUTES: Route[] = [
  {
    canActivate: [authenticatedGuard],
    path: '',
    component: ThemedLogoutPageComponent,
    data: { title: 'logout.title' },
  },
];
