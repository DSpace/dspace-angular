import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Collection } from '../../../../core/shared/collection.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../../../../core/shared/item.model';
import { getItemEditPath } from '../../../../+item-page/item-page-routing.module';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType
} from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing items inside a modal
 * Used to choose an item from to edit
 */

@Component({
  selector: 'ds-edit-item-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class EditItemSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.ITEM;
  selectorType = DSpaceObjectType.ITEM;
  action = SelectorActionType.EDIT;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the item edit page
   */
  navigate(dso: DSpaceObject) {
    this.router.navigate([getItemEditPath(dso.uuid)]);
  }
}
