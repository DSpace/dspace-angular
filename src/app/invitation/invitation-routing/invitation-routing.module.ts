import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvitationAcceptanceComponent } from '../invitation-acceptance/invitation-acceptance.component';
import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { ValidTokenGuard } from '../valid-token.guard';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':registrationToken',
        data: {
          title: 'invitation',
        },
        component: InvitationAcceptanceComponent,
        canActivate: [AuthenticatedGuard, ValidTokenGuard]
      },
    ])
  ]
})
export class InvitationRoutingModule { }
