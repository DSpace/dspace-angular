import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing collections inside a modal
 * Used to choose a collection from to create a new item in
 */

@Component({
  selector: 'ds-create-item-parent-selector',
  // styleUrls: ['./create-item-parent-selector.component.scss'],
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class CreateItemParentSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.ITEM;
  selectorType = DSpaceObjectType.COLLECTION;
  action = SelectorActionType.CREATE;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the item create page
   */
  navigate(dso: DSpaceObject) {
   // There's no submit path per collection yet...
  }
}
