import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationExtras,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../environments/environment';
import {
  COMMUNITY_PARENT_PARAMETER,
  getCommunityCreateRoute,
} from '../../../../community-page/community-page-routing-paths';
import {
  SortDirection,
  SortOptions,
} from '../../../../core/cache/models/sort-options.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { hasValue } from '../../../empty.util';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a button - for top communities -
 * and a list of parent communities - for sub communities
 * inside a modal
 * Used to create a new community
 */

@Component({
  selector: 'ds-base-create-community-parent-selector',
  styleUrls: ['./create-community-parent-selector.component.scss'],
  templateUrl: './create-community-parent-selector.component.html',
  standalone: true,
  imports: [DSOSelectorComponent, TranslateModule],
})
export class CreateCommunityParentSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COMMUNITY;
  selectorTypes = [DSpaceObjectType.COMMUNITY];
  action = SelectorActionType.CREATE;
  defaultSort = new SortOptions(environment.comcolSelectionSort.sortField, environment.comcolSelectionSort.sortDirection as SortDirection);

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the community create page
   */
  navigate(dso: DSpaceObject) {
    let navigationExtras: NavigationExtras = {};
    if (hasValue(dso)) {
      navigationExtras = {
        queryParams: {
          [COMMUNITY_PARENT_PARAMETER]: dso.uuid,
        },
      };
    }
    this.router.navigate([getCommunityCreateRoute()], navigationExtras);
  }
}
