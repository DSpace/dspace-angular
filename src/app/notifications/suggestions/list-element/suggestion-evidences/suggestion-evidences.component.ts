
import {
  Component,
  Input,
} from '@angular/core';
import { SuggestionEvidences } from '@dspace/core/notifications/suggestions/models/suggestion.model';
import { TranslateModule } from '@ngx-translate/core';

import { fadeIn } from '../../../../shared/animations/fade';
import { ObjectKeysPipe } from '../../../../shared/utils/object-keys-pipe';

/**
 * Show suggestion evidences such as score (authorScore, dateScore)
 */
@Component({
  selector: 'ds-suggestion-evidences',
  styleUrls: ['./suggestion-evidences.component.scss'],
  templateUrl: './suggestion-evidences.component.html',
  animations: [fadeIn],
  imports: [
    ObjectKeysPipe,
    TranslateModule,
  ],
  standalone: true,
})
export class SuggestionEvidencesComponent {

  @Input() evidences: SuggestionEvidences;

}
