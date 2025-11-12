import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';
import { getCommunityEditRoute } from '../../../../community-page/community-page-routing-paths';
import { AuthorizedCommunitySelectorComponent } from '../../dso-selector/authorized-community-selector/authorized-community-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to edit
 */

@Component({
  selector: 'ds-base-edit-community-selector',
  templateUrl: './edit-community-selector.component.html',
  standalone: true,
  imports: [
    AuthorizedCommunitySelectorComponent,
    TranslateModule,
  ],
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
