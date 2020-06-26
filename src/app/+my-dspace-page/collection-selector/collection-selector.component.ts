import { Component, OnInit } from '@angular/core';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from 'src/app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from 'src/app/core/shared/dspace-object-type.model';

@Component({
  selector: 'ds-collection-selector',
  templateUrl: './collection-selector.component.html',
  styleUrls: ['./collection-selector.component.scss']
})
export class CollectionSelectorComponent extends DSOSelectorModalWrapperComponent {
  objectType = DSpaceObjectType.ITEM;
  selectorType = DSpaceObjectType.COLLECTION;
  action = SelectorActionType.CREATE;

  navigate(dso: DSpaceObject) {
    throw new Error('Method not implemented.');
  }

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Method called when an element has been selected from collection list.
   * Its close the active modal and send selected value to the component container
   * @param dso The selected DSpaceObject
   */
  selectObject(dso: DSpaceObject) {
    this.activeModal.close(dso);
  }

}
