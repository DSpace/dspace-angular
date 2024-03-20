import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
import { ErrorComponent } from '../../error/error.component';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { VarDirective } from '../../utils/var.directive';
import { ObjectSelectService } from '../object-select.service';
import { ObjectSelectComponent } from '../object-select/object-select.component';

@Component({
  selector: 'ds-item-select',
  templateUrl: './item-select.component.html',
  standalone: true,
  imports: [VarDirective, NgIf, PaginationComponent, NgFor, FormsModule, RouterLink, ErrorComponent, ThemedLoadingComponent, NgClass, AsyncPipe, TranslateModule],
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
