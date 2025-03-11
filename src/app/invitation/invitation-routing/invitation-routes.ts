import { Route } from '@angular/router';

import { authenticatedGuard } from '../../core/auth/authenticated.guard';
import { InvitationAcceptanceComponent } from '../invitation-acceptance/invitation-acceptance.component';
import { validTokenGuard } from '../valid-token.guard';

export const ROUTES: Route[] = [
  {
    path: ':registrationToken',
    data: {
      title: 'invitation',
    },
    component: InvitationAcceptanceComponent,
    canActivate: [authenticatedGuard, validTokenGuard],
  },
];
