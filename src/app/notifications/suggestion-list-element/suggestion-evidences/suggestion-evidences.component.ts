import {
  Component,
  Input,
} from '@angular/core';

import { SuggestionEvidences } from '../../../core/notifications/models/suggestion.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { ObjectKeysPipe } from '../../../shared/utils/object-keys-pipe';

import { fadeIn } from '../../../shared/animations/fade';

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
    ObjectKeysPipe
  ],
  standalone: true
})
export class SuggestionEvidencesComponent {

  @Input() evidences: SuggestionEvidences;

}
