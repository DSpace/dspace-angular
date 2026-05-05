import { NgIf } from '@angular/common';
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
import { ActionType } from 'src/app/core/resource-policy/models/action-type.model';

import { environment } from '../../../../../environments/environment';
import {
  COLLECTION_PARENT_PARAMETER,
  getCollectionCreateRoute,
} from '../../../../collection-page/collection-page-routing-paths';
import {
  SortDirection,
  SortOptions,
} from '../../../../core/cache/models/sort-options.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { AuthorizedCommunitySelectorComponent } from '../../dso-selector/authorized-community-selector/authorized-community-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';
/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to create a new collection in
 */

@Component({
  selector: 'ds-base-create-collection-parent-selector',
  templateUrl: './create-collection-parent-selector.component.html',
  standalone: true,
  imports: [NgIf, AuthorizedCommunitySelectorComponent, TranslateModule],
})
export class CreateCollectionParentSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.COLLECTION;
  selectorTypes = [DSpaceObjectType.COMMUNITY];
  action = SelectorActionType.CREATE;
  rpActionType = ActionType.ADD;
  header = 'dso-selector.create.collection.sub-level';
  defaultSort = new SortOptions(environment.comcolSelectionSort.sortField, environment.comcolSelectionSort.sortDirection as SortDirection);

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
      },
    };
    this.router.navigate([getCollectionCreateRoute()], navigationExtras);
  }
}
