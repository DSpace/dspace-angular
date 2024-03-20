import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../../core/shared/item.model';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import {
  hasValueOperator,
  isNotEmpty,
} from '../../empty.util';
import { ObjectSelectService } from '../object-select.service';
import { ObjectSelectComponent } from '../object-select/object-select.component';

@Component({
  selector: 'ds-item-select',
  templateUrl: './item-select.component.html',
})

/**
 * A component used to select items from a specific list and returning the UUIDs of the selected items
 */
export class ItemSelectComponent extends ObjectSelectComponent<Item> implements OnInit {

  /**
   * Whether or not to hide the collection column
   */
  @Input()
    hideCollection = false;

  /**
   * The routes to the items their pages
   * Key: Item ID
   * Value: Route to item page
   */
  itemPageRoutes$: Observable<{
    [itemId: string]: string
  }>;

  constructor(
    protected objectSelectService: ObjectSelectService,
    protected authorizationService: AuthorizationDataService,
    public dsoNameService: DSONameService,
  ) {
    super(objectSelectService, authorizationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'item.select.confirm';
    }
    this.itemPageRoutes$ = this.dsoRD$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteDataPayload(),
      map((items) => {
        const itemPageRoutes = {};
        items.page.forEach((item) => itemPageRoutes[item.uuid] = getItemPageRoute(item));
        return itemPageRoutes;
      }),
    );
  }

}
