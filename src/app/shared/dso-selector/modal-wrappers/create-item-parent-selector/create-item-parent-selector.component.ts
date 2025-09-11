
import {
  Component,
  Input,
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
  SortDirection,
  SortOptions,
} from '../../../../core/cache/models/sort-options.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { AuthorizedCollectionSelectorComponent } from '../../dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import {
  DSOSelectorModalWrapperComponent,
  SelectorActionType,
} from '../dso-selector-modal-wrapper.component';

/**
 * Component to wrap a list of existing collections inside a modal
 * Used to choose a collection from to create a new item in
 */

@Component({
  selector: 'ds-base-create-item-parent-selector',
  // styleUrls: ['./create-item-parent-selector.component.scss'],
  // templateUrl: '../dso-selector-modal-wrapper.component.html',
  templateUrl: './create-item-parent-selector.component.html',
  standalone: true,
  imports: [
    AuthorizedCollectionSelectorComponent,
    TranslateModule,
  ],
})
export class CreateItemParentSelectorComponent extends DSOSelectorModalWrapperComponent implements OnInit {
  objectType = DSpaceObjectType.ITEM;
  selectorTypes = [DSpaceObjectType.COLLECTION];
  action = SelectorActionType.CREATE;
  header = 'dso-selector.create.item.sub-level';
  defaultSort = new SortOptions(environment.comcolSelectionSort.sortField, environment.comcolSelectionSort.sortDirection as SortDirection);

  /**
   * If present this value is used to filter collection list by entity type
   */
  @Input() entityType: string;

  constructor(protected activeModal: NgbActiveModal, protected route: ActivatedRoute, private router: Router) {
    super(activeModal, route);
  }

  /**
   * Navigate to the item create page
   */
  navigate(dso: DSpaceObject) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        ['collection']: dso.uuid,
      },
    };
    if (this.entityType) {
      navigationExtras.queryParams.entityType = this.entityType;
    }
    this.router.navigate(['/submit'], navigationExtras);
  }
}
