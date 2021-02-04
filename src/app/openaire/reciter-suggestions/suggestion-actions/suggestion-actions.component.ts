import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OpenaireSuggestion } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { SuggestionApproveAndImport } from '../suggestion-list-element/suggestion-list-element.component';
import { Collection } from '../../../core/shared/collection.model';
import { take } from 'rxjs/operators';
import { CreateItemParentSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { CollectionListEntry } from '../../../shared/collection-dropdown/collection-dropdown.component';

@Component({
  selector: 'ds-suggestion-actions',
  styleUrls: [ './suggestion-actions.component.scss' ],
  templateUrl: './suggestion-actions.component.html'
})
export class SuggestionActionsComponent {

  @Input() object: OpenaireSuggestion;

  @Input() isBulk = false;

  @Input() public hasEvidence = false;

  @Input() public seeEvidence = false;

  /**
   * The component is used to Delete suggestion
   */
  @Output() notMineClicked = new EventEmitter<string>();

  /**
   * The component is used to approve & import
   */
  @Output() approveAndImport = new EventEmitter<SuggestionApproveAndImport>();

  /**
   * The component is used to approve & import
   */
  @Output() seeEvidences = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal) { }

  /**
   * Emits an approveAndImport event
   * @param entry
   */
  onCollectionChange(entry: CollectionListEntry) {
    this.approveAndImport.emit({
      suggestion: this.isBulk ? undefined : this.object,
      collectionId: entry.collection.id
    });
  }

  /**
   * Delete the suggestion
   */
  notMine() {
    this.notMineClicked.emit(this.isBulk ? undefined : this.object.id);
  }

  /**
   * Toggle See Evidence
   */
  toggleSeeEvidences() {
    this.seeEvidences.emit(!this.seeEvidence);
  }

  notMineLabel(): string {
    return this.isBulk ? 'reciter.suggestion.notMine.bulk' : 'reciter.suggestion.notMine' ;
  }

  approveAndImportLabel(): string {
    return this.isBulk ? 'reciter.suggestion.approveAndImport.bulk' : 'reciter.suggestion.approveAndImport';
  }
}
