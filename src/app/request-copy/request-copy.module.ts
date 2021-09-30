import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GrantDenyRequestCopyComponent } from './grant-deny-request-copy/grant-deny-request-copy.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    GrantDenyRequestCopyComponent
  ],
  providers: []
})

/**
 * Module related to components used to register a new user
 */
export class RequestCopyModule {

}
