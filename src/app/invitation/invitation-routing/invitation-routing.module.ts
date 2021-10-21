import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvitationAcceptanceComponent } from '../invitation-acceptance/invitation-acceptance.component';


@NgModule({
  imports: [
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
