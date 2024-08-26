import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InvitationAcceptanceComponent } from './invitation-acceptance/invitation-acceptance.component';
import { InvitationRoutingModule } from './invitation-routing/invitation-routing.module';


@NgModule({
  declarations: [InvitationAcceptanceComponent],
  imports: [
    CommonModule,
    InvitationRoutingModule,
  ],
})
export class InvitationModule { }
