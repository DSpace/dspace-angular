import {
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SuggestionEvidences } from '../../../core/notifications/suggestions/models/suggestion.model';
import { fadeIn } from '../../../shared/animations/fade';
import { ObjectKeysPipe } from '../../../shared/utils/object-keys-pipe';

/**
 * Show suggestion evidences such as score (authorScore, dateScore)
 */
@Component({
  selector: 'ds-suggestion-evidences',
  styleUrls: ['./suggestion-evidences.component.scss'],
  templateUrl: './suggestion-evidences.component.html',
  animations: [fadeIn],
  imports: [
    TranslateModule,
    NgIf,
    NgFor,
    ObjectKeysPipe,
  ],
  standalone: true,
})
export class SuggestionEvidencesComponent {

  @Input() evidences: SuggestionEvidences;

}
