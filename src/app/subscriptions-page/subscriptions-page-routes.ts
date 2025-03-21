import { Route } from '@angular/router';

import { SubscriptionsPageComponent } from './subscriptions-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    data: {
      title: 'subscriptions.title',
    },
    children: [
      {
        path: '',
        component: SubscriptionsPageComponent,
      },
    ],
  },
];
