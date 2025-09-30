import {
  AsyncPipe,
  NgClass,
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

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Item } from '../../../core/shared/item.model';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { BtnDisabledDirective } from '../../btn-disabled.directive';
import {
  hasValueOperator,
  isNotEmpty,
} from '../../empty.util';
import { ErrorComponent } from '../../error/error.component';
import { ThemedLoadingComponent } from '../../loading/themed-loading.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { VarDirective } from '../../utils/var.directive';
import { DSpaceObjectSelect } from '../object-select.model';
import { ObjectSelectComponent } from '../object-select/object-select.component';

@Component({
  selector: 'ds-item-select',
  templateUrl: './item-select.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    ErrorComponent,
    FormsModule,
    NgClass,
    PaginationComponent,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
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
   * Collection of all the data that is used to display the {@link Item} in the HTML.
   * By collecting this data here it doesn't need to be recalculated on every change detection.
   */
  selectItems$: Observable<DSpaceObjectSelect<Item>[]>;

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'item.select.confirm';
    }
    this.selectItems$ = this.dsoRD$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteDataPayload(),
      map((items: PaginatedList<Item>) => items.page.map((item: Item) => Object.assign(new DSpaceObjectSelect<Item>(), {
        dso: item,
        canSelect$: this.canSelect(item),
        selected$: this.getSelected(item.id),
        route: getItemPageRoute(item),
      } as DSpaceObjectSelect<Item>))),
    );
  }

}
