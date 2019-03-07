import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { hasValue } from '../../../empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType
} from '../dso-selector-modal-wrapper.component';

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

  navigate(dso: DSpaceObject) {
   //There's no submit path per collection yet...
  }
}
