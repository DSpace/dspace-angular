import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeIn } from '../../../../shared/animations/fade';
import { SuggestionEvidences } from '../../../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';

@Component({
  selector: 'ds-suggestion-evidence-list',
  styleUrls: [ './suggestion-evidences.component.scss' ],
  templateUrl: './suggestion-evidences.component.html',
  animations: [fadeIn]
})
export class SuggestionEvidenceListItemComponent {

  @Input() evidences: SuggestionEvidences;

  @Output() backClicked = new EventEmitter();

  back() {
    this.backClicked.emit({});
  }

}
