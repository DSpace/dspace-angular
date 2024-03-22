import { Component } from '@angular/core';

import { PublicationClaimComponent } from '../../../notifications/suggestion-targets/publication-claim/publication-claim.component';

@Component({
  selector: 'ds-admin-notifications-publication-claim-page',
  templateUrl: './admin-notifications-publication-claim-page.component.html',
  styleUrls: ['./admin-notifications-publication-claim-page.component.scss'],
  imports: [
    PublicationClaimComponent,
  ],
  standalone: true,
})
export class AdminNotificationsPublicationClaimPageComponent {

}
