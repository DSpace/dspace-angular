import { Component } from '@angular/core';

import { PublicationClaimComponent } from '../../notifications/suggestion-targets/publication-claim/publication-claim.component';

@Component({
  selector: 'ds-notifications-reciter-page',
  templateUrl: './notifications-suggestion-targets-page.component.html',
  styleUrls: ['./notifications-suggestion-targets-page.component.scss'],
  imports: [
    PublicationClaimComponent,
  ],
  standalone: true,
})
export class NotificationsSuggestionTargetsPageComponent {

}
