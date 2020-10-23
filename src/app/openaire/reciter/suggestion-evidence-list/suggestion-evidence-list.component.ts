import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { fadeIn } from '../../../shared/animations/fade';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-suggestion-evidence-list',
  styleUrls: [ './suggestion-evidence-list.component.scss' ],
  templateUrl: './suggestion-evidence-list.component.html',
  animations: [fadeIn]
})
export class SuggestionEvidenceListItemComponent {

  @Input() evidences: any;

  @Output() backClicked = new EventEmitter();

  back() {
    this.backClicked.emit({});
  }

}
