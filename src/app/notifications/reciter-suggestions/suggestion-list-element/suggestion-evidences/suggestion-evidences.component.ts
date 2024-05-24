import {
  Component,
  Input,
} from '@angular/core';

import { SuggestionEvidences } from '../../../../core/notifications/reciter-suggestions/models/openaire-suggestion.model';
import { fadeIn } from '../../../../shared/animations/fade';

@Component({
  selector: 'ds-suggestion-evidences',
  styleUrls: [ './suggestion-evidences.component.scss' ],
  templateUrl: './suggestion-evidences.component.html',
  animations: [fadeIn],
})
export class SuggestionEvidencesComponent {

  @Input() evidences: SuggestionEvidences;

}
