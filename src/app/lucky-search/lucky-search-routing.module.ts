import { Route } from '@angular/router';

import { LuckySearchComponent } from './search/lucky-search.component';

export const ROUTES: Route[] = [
  {
    path: '',
    data: {
      title: 'lucky-search',
    },
    children: [
      {
        path: '',
        component: LuckySearchComponent,
      },
    ],
  },
];
