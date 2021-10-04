import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';
import { RequestCopyRoutingModule } from './request-copy-routing.module';
import { DenyRequestCopyComponent } from './deny-request-copy/deny-request-copy.component';
import { EmailRequestCopyComponent } from './email-request-copy/email-request-copy.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RequestCopyRoutingModule
  ],
  declarations: [
    GrantDenyRequestCopyComponent,
    DenyRequestCopyComponent,
    EmailRequestCopyComponent,
  ],
  providers: []
})

/**
 * Module related to components used to register a new user
 */
export class RequestCopyModule {

}
