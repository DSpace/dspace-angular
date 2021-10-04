import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestCopyResolver } from './request-copy.resolver';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';
import { REQUEST_COPY_DENY_PATH, REQUEST_COPY_GRANT_PATH } from './request-copy-routing-paths';
import { DenyRequestCopyComponent } from './deny-request-copy/deny-request-copy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':token',
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
            component: DenyRequestCopyComponent,
          }
        ]
      }
    ])
  ],
  providers: [
    RequestCopyResolver,
    GrantDenyRequestCopyComponent
  ]
})
export class RequestCopyRoutingModule {
}
