import { Route } from '@angular/router';
import { RequestCopyResolver } from './request-copy.resolver';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';
import { REQUEST_COPY_DENY_PATH, REQUEST_COPY_GRANT_PATH } from './request-copy-routing-paths';
import { ThemedDenyRequestCopyComponent } from './deny-request-copy/themed-deny-request-copy.component';
import { ThemedGrantRequestCopyComponent } from './grant-request-copy/themed-grant-request-copy.component';

export const ROUTES: Route[] = [
  {
    path: ':token',
    providers: [
      RequestCopyResolver,
      GrantDenyRequestCopyComponent
    ],
    resolve: {
      request: RequestCopyResolver
    },
    children: [
      {
        path: '',
        component: GrantDenyRequestCopyComponent,
      },
      {
        path: REQUEST_COPY_DENY_PATH,
        component: ThemedDenyRequestCopyComponent,
      },
      {
        path: REQUEST_COPY_GRANT_PATH,
        component: ThemedGrantRequestCopyComponent,
      },
    ]
  }
];
