import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType
} from '../dso-selector-modal-wrapper.component';
import { getCommunityEditRoute } from '../../../../community-page/community-page-routing-paths';
import { SortDirection, SortOptions } from '../../../../core/cache/models/sort-options.model';
import { environment } from '../../../../../environments/environment';

/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to edit
 */

@Component({
  selector: 'ds-edit-community-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})

export class EditCommunitySelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COMMUNITY;
  selectorTypes = [DSpaceObjectType.COMMUNITY];
  action = SelectorActionType.EDIT;
  defaultSort = new SortOptions(environment.comcolSelectionSort.sortField, environment.comcolSelectionSort.sortDirection as SortDirection);

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the community edit page
   */
  navigate(dso: DSpaceObject) {
    this.router.navigate([getCommunityEditRoute(dso.uuid)]);
  }
}
