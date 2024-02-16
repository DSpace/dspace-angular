import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Collection } from '../../core/shared/collection.model';
import { take } from 'rxjs/operators';
import { CreateItemParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { Suggestion } from '../../core/notifications/models/suggestion.model';
import { SuggestionApproveAndImport } from '../suggestion-list-element/suggestion-list-element.component';

/**
 * Show and trigger the actions to submit for a suggestion
 */
@Component({
  selector: 'ds-suggestion-actions',
  styleUrls: [ './suggestion-actions.component.scss' ],
  templateUrl: './suggestion-actions.component.html'
})
export class SuggestionActionsComponent {

  @Input() object: Suggestion;

  @Input() isBulk = false;

  @Input() hasEvidence = false;

  @Input() seeEvidence = false;

  @Input() isCollectionFixed = false;

  /**
   * The component is used to Delete suggestion
   */
  @Output() ignoreSuggestionClicked = new EventEmitter<string>();

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
   * Method called on clicking the button "approve & import", It opens a dialog for
   * select a collection and it emits an approveAndImport event.
   */
  openDialog(entity: ItemType) {

    const modalRef = this.modalService.open(CreateItemParentSelectorComponent);
    modalRef.componentInstance.emitOnly = true;
    modalRef.componentInstance.entityType = entity.label;

    modalRef.componentInstance.select.pipe(take(1))
      .subscribe((collection: Collection) => {
        this.approveAndImport.emit({
          suggestion: this.isBulk ? undefined : this.object,
          collectionId: collection.id
        });
      });
  }

  approveAndImportCollectionFixed() {
    this.approveAndImport.emit({
      suggestion: this.isBulk ? undefined : this.object,
      collectionId: null
    });
  }


  /**
   * Delete the suggestion
   */
  ignoreSuggestion() {
    this.ignoreSuggestionClicked.emit(this.isBulk ? undefined : this.object.id);
  }

  /**
   * Toggle See Evidence
   */
  toggleSeeEvidences() {
    this.seeEvidences.emit(!this.seeEvidence);
  }

  ignoreSuggestionLabel(): string {
    return this.isBulk ? 'suggestion.ignoreSuggestion.bulk' : 'suggestion.ignoreSuggestion' ;
  }

  approveAndImportLabel(): string {
    return this.isBulk ? 'suggestion.approveAndImport.bulk' : 'suggestion.approveAndImport';
  }
}
