import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getCommunityEditPath } from '../../../../+community-page/community-page-routing.module';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType
} from '../dso-selector-modal-wrapper.component';

@Component({
  selector: 'ds-edit-community-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})

export class EditCommunitySelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COMMUNITY;
  selectorType = DSpaceObjectType.COMMUNITY;
  action = SelectorActionType.EDIT;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  navigate(dso: DSpaceObject) {
    this.router.navigate([getCommunityEditPath(dso.uuid)]);
  }
}
