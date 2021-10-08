import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSOSelectorModalWrapperComponent, SelectorActionType } from '../../dso-selector/modal-wrappers/dso-selector-modal-wrapper.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

/**
 * Component to wrap a button - for top communities -
 * and a list of parent communities - for sub communities
 * inside a modal
 * Used to create a new community
 */

@Component({
  selector: 'ds-scope-selector-modal',
  styleUrls: ['./scope-selector-modal.component.scss'],
  templateUrl: './scope-selector-modal.component.html',
})
export class ScopeSelectorModalComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COMMUNITY;
  selectorTypes = [DSpaceObjectType.COMMUNITY, DSpaceObjectType.COLLECTION];
  action = SelectorActionType.SET_SCOPE;
  scopeChange = new EventEmitter<DSpaceObject>();

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute) {
    super(activeModal, route);
  }

  navigate(dso: DSpaceObject) {
    /* Handle search navigation in underlying component */
    this.scopeChange.emit(dso);
  }
}
