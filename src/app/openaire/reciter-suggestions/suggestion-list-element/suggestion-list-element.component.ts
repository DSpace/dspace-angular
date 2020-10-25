import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { fadeIn } from '../../../shared/animations/fade';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { OpenaireSuggestion } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { Item } from '../../../core/shared/item.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { Collection } from '../../../core/shared/collection.model';

@Component({
  selector: 'ds-suggestion-list-item',
  styleUrls: ['./suggestion-list-element.component.scss'],
  templateUrl: './suggestion-list-element.component.html',
  animations: [fadeIn]
})
export class SuggestionListElementComponent implements OnInit {

  @Input() object: OpenaireSuggestion;

  public listableObject: any;

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

  ngOnInit() {
    this.listableObject = {
      indexableObject: Object.assign(new Item(), {id: this.object.id, metadata: this.object.metadata}),
      hitHighlights: {}
    }
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
  hasEvidences() {
    return isNotEmpty(this.object.evidences);
  }

  /**
   * See the Evidence
   */
  seeEvidences() {
    this.seeEvidenceClicked.emit(this.object.evidences);
  }

  /**
   * Used to approve & import
   */
  selectedCollection(collection: Collection) {
    this.approveAndImport.emit({ suggestion: this.object, collectionId: collection.id });
  }
}
