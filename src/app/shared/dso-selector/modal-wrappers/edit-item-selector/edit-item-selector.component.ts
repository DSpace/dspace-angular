
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { Item } from '../../../../core/shared/item.model';
import { getItemEditRoute } from '../../../../item-page/item-page-routing-paths';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector.component';
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
  standalone: true,
  imports: [
    DSOSelectorComponent,
    TranslateModule,
  ],
})
export class EditItemSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.ITEM;
  selectorTypes = [DSpaceObjectType.ITEM];
  action = SelectorActionType.EDIT;

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
