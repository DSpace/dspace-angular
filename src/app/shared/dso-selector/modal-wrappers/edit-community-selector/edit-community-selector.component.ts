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
import { ActionType } from 'src/app/core/resource-policy/models/action-type.model';

/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to edit
 */

@Component({
  selector: 'ds-edit-community-selector',
  templateUrl: './edit-community-selector.component.html',
})

export class EditCommunitySelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COMMUNITY;
  selectorTypes = [DSpaceObjectType.COMMUNITY];
  action = SelectorActionType.EDIT;
  // for editing communities, admin permissions are required
  rpActionType = ActionType.ADMIN;
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
