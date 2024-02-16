import { Component, Input } from '@angular/core';
<<<<<<<< HEAD:src/app/notifications/reciter-suggestions/suggestion-list-element/suggestion-evidences/suggestion-evidences.component.ts
import { fadeIn } from '../../../../shared/animations/fade';
import { SuggestionEvidences } from '../../../../core/notifications/reciter-suggestions/models/suggestion.model';
========
import { fadeIn } from '../../../shared/animations/fade';
import { SuggestionEvidences } from '../../../core/suggestion-notifications/models/suggestion.model';
>>>>>>>> main:src/app/notifications/suggestion-list-element/suggestion-evidences/suggestion-evidences.component.ts

/**
 * Show suggestion evidences such as score (authorScore, dateScore)
 */
@Component({
  selector: 'ds-suggestion-evidences',
  styleUrls: [ './suggestion-evidences.component.scss' ],
  templateUrl: './suggestion-evidences.component.html',
  animations: [fadeIn]
})
export class SuggestionEvidencesComponent {

  @Input() evidences: SuggestionEvidences;

}
