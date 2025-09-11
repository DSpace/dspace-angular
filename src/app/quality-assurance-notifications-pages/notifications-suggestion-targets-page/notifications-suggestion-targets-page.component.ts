import { Component } from '@angular/core';

import { SuggestionSourcesComponent } from '../../notifications/suggestions/sources/suggestion-sources.component';

@Component({
  selector: 'ds-notifications-reciter-page',
  templateUrl: './notifications-suggestion-targets-page.component.html',
  styleUrls: ['./notifications-suggestion-targets-page.component.scss'],
  imports: [
    SuggestionSourcesComponent,
  ],
  standalone: true,
})
export class NotificationsSuggestionTargetsPageComponent {

}
