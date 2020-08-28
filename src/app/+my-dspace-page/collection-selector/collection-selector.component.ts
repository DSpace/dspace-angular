import { Component } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * This component displays the dialog that shows the list of selectable collections
 * on the MyDSpace page
 */
@Component({
  selector: 'ds-collection-selector',
  templateUrl: './collection-selector.component.html',
  styleUrls: ['./collection-selector.component.scss']
})
export class CollectionSelectorComponent {

  constructor(protected activeModal: NgbActiveModal) {}

  /**
   * Method called when an element has been selected from collection list.
   * Its close the active modal and send selected value to the component container
   * @param dso The selected DSpaceObject
   */
  selectObject(dso: DSpaceObject) {
    this.activeModal.close(dso);
  }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }
}
