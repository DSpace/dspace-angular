import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';

import { fadeIn } from '../../../shared/animations/fade';
import { OpenaireSuggestion } from '../../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { Item } from '../../../core/shared/item.model';
import { isNotEmpty } from '../../../shared/empty.util';
import { Collection } from '../../../core/shared/collection.model';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { CreateItemParentSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';

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
    }
  }

  /**
   * Delete the suggestion
   */
  notMine() {
    this.notMineClicked.emit(this.object.id);
  }

  /**
   * Method called on clicking the button "approve & import", It opens a dialog for
   * select a collection and it emits an approveAndImport event.
   */
  openDialog(entity: ItemType) {
    const modalRef = this.modalService.open(CreateItemParentSelectorComponent);
    modalRef.componentInstance.emitOnly = true;
    modalRef.componentInstance.metadata = 'relationship.type';
    modalRef.componentInstance.metadatavalue = entity.label;

    modalRef.componentInstance.select.pipe(take(1))
      .subscribe((collection: Collection) => {
        this.approveAndImport.emit({ suggestion: this.object, collectionId: collection.id });
      })
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

}
