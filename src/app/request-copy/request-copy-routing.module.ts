import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EndUserAgreementCookieGuard } from '../core/end-user-agreement/end-user-agreement-cookie.guard';
import { RequestCopyResolver } from './request-copy.resolver';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':token',
        component: GrantDenyRequestCopyComponent,
        resolve: {request: RequestCopyResolver},
        canActivate: [EndUserAgreementCookieGuard]
      }
    ])
  ],
  providers: [
    RequestCopyResolver,
    GrantDenyRequestCopyComponent
  ]
})
/**
 * Module related to the navigation to components used to register a new user
 */
export class RegisterPageRoutingModule {
}
