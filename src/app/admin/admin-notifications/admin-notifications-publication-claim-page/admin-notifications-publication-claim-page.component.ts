import { Component } from '@angular/core';

import { SuggestionSourcesComponent } from '../../../notifications/suggestions/sources/suggestion-sources.component';

@Component({
  selector: 'ds-admin-notifications-publication-claim-page',
  templateUrl: './admin-notifications-publication-claim-page.component.html',
  styleUrls: ['./admin-notifications-publication-claim-page.component.scss'],
  imports: [
    SuggestionSourcesComponent,
  ],
  standalone: true,
})
export class AdminNotificationsPublicationClaimPageComponent {

}
