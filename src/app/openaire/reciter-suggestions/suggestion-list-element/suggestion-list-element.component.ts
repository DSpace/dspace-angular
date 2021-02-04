import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { fadeIn } from '../../../shared/animations/fade';
import { OpenaireSuggestion } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { Item } from '../../../core/shared/item.model';
import { isNotEmpty } from '../../../shared/empty.util';

export interface SuggestionApproveAndImport {
  suggestion: OpenaireSuggestion;
  collectionId: string;
}

@Component({
  selector: 'ds-suggestion-list-item',
  styleUrls: ['./suggestion-list-element.component.scss'],
  templateUrl: './suggestion-list-element.component.html',
  animations: [fadeIn]
})
export class SuggestionListElementComponent implements OnInit {

  @Input() object: OpenaireSuggestion;

  @Input() isSelected = false;

  public listableObject: any;

  public seeEvidence = false;

  /**
   * The component is used to Delete suggestion
   */
  @Output() notMineClicked = new EventEmitter();

  /**
   * The component is used to approve & import
   */
  @Output() approveAndImport = new EventEmitter();

  /**
   * New value whether the element is selected
   */
  @Output() selected = new EventEmitter<boolean>();

  /**
   * Initialize instance variables
   *
   * @param {NgbModal} modalService
   */
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.listableObject = {
      indexableObject: Object.assign(new Item(), {id: this.object.id, metadata: this.object.metadata}),
      hitHighlights: {}
    };
  }

  /**
   * Approve and import the suggestion
   */
  onApproveAndImport(event: SuggestionApproveAndImport) {
    this.approveAndImport.emit(event);
  }

  /**
   * Delete the suggestion
   */
  onNotMine(suggestionId: string) {
    this.notMineClicked.emit(suggestionId);
  }

  /**
   * Change is selected value.
   */
  changeSelected(event) {
    this.isSelected = event.target.checked;
    this.selected.next(this.isSelected);
  }

  /**
   * See the Evidence
   */
  hasEvidences() {
    return isNotEmpty(this.object.evidences);
  }

  /**
   * Set the see evidence variable.
   */
  onSeeEvidences(seeEvidence: boolean) {
    this.seeEvidence = seeEvidence;
  }

}
