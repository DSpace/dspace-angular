import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InvitationAcceptanceComponent } from './invitation-acceptance/invitation-acceptance.component';
import { InvitationRoutingModule } from './invitation-routing/invitation-routing.module';


@NgModule({
  declarations: [InvitationAcceptanceComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvitationRoutingModule
  ]
})
export class InvitationModule { }
