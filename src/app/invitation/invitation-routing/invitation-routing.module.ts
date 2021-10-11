import { NgModule } from '@angular/core';
import {InvitationModule} from '../invitation.module';
import {RouterModule} from '@angular/router';
import {InvitationAcceptanceComponent} from '../invitation-acceptance/invitation-acceptance.component';


@NgModule({
  imports: [
    InvitationModule,
    RouterModule.forChild([
      {
        path: '',
        data: {
          title: 'invitation',
        },
        children: [
          {
            path: '',
            component: InvitationAcceptanceComponent,
          },
        ]
      },
    ])
  ]
})
export class InvitationRoutingModule { }
