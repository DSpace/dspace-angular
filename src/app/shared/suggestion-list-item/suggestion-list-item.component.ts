import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { fadeIn } from '../animations/fade';
import { SelectableListService } from '../object-list/selectable-list/selectable-list.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-suggestion-list-item',
  styleUrls: [ './suggestion-list-item.component.scss' ],
  templateUrl: './suggestion-list-item.component.html',
  animations: [fadeIn]
})
export class SuggestionListItemComponent {

  @Input() object: any;

  /**
   * The component is used to Delete suggestion
   */
  @Output() notMineClicked = new EventEmitter();

  /**
   * The component is used to See Evidence
   */
  @Output() seeEvidenceClicked = new EventEmitter();

  /**
   * The component is used to approve & import
   */
  @Output() approveAndImport = new EventEmitter();

  constructor(protected selectionService: SelectableListService) {
  }

  /**
   * Delete the suggestion
   */
  notMine() {
    this.notMineClicked.emit(this.object.id);
  }

  /**
   * See the Evidence
   */
  seeEvidence() {
    this.seeEvidenceClicked.emit(this.object.evidences);
  }

  selectedCollection(event) {
    this.approveAndImport.emit({collectionId: this.object.id, suggestionId: event});
  }
}
