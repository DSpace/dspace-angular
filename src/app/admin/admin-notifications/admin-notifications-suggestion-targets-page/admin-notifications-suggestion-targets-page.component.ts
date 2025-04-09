import { Component } from '@angular/core';

import { PublicationClaimComponent } from '../../../notifications/suggestion-targets/publication-claim/publication-claim.component';

@Component({
  selector: 'ds-admin-notifications-reciter-page',
  templateUrl: './admin-notifications-suggestion-targets-page.component.html',
  styleUrls: ['./admin-notifications-suggestion-targets-page.component.scss'],
  standalone: true,
  imports: [
    PublicationClaimComponent,
  ],
})
export class AdminNotificationsSuggestionTargetsPageComponent {

}
