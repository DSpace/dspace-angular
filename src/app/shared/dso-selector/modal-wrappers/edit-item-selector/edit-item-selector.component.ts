
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ActionType } from '@dspace/core/resource-policy/models/action-type.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import { Item } from '@dspace/core/shared/item.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { getItemEditRoute } from '../../../../item-page/item-page-routing-paths';
import { AuthorizedItemSelectorComponent } from '../../dso-selector/authorized-item-selector/authorized-item-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing items inside a modal
 * Used to choose an item from to edit
 */

@Component({
  selector: 'ds-base-edit-item-selector',
  templateUrl: 'edit-item-selector.component.html',
  imports: [
    AuthorizedItemSelectorComponent,
    TranslateModule,
  ],
})
export class EditItemSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.ITEM;
  selectorTypes = [DSpaceObjectType.ITEM];
  action = SelectorActionType.EDIT;
  rpActionType = ActionType.WRITE;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the item edit page
   */
  navigate(dso: DSpaceObject) {
    this.router.navigate([getItemEditRoute(dso as Item)]);
  }
}
