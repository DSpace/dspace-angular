import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  COLLECTION_PARENT_PARAMETER,
  getCollectionCreatePath
} from '../../../../+collection-page/collection-page-routing.module';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType
} from '../dso-selector-modal-wrapper.component';

@Component({
  selector: 'ds-create-collection-parent-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class CreateCollectionParentSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COLLECTION;
  selectorType = DSpaceObjectType.COMMUNITY;
  action = SelectorActionType.CREATE;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the collection create page
   */
  navigate(dso: DSpaceObject) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        [COLLECTION_PARENT_PARAMETER]: dso.uuid,
      }
    };
    this.router.navigate([getCollectionCreatePath()], navigationExtras);
  }
}
