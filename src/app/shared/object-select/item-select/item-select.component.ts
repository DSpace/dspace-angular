import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ObjectSelectComponent } from '../object-select/object-select.component';
import { hasValueOperator, isNotEmpty } from '../../empty.util';
import { Observable } from 'rxjs';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { DSpaceObjectSelect } from '../object-select.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ds-item-select',
  templateUrl: './item-select.component.html'
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
   * By collecting this data here it doesn't need to be recalculated on evey change detection.
   */
  selectItems$: Observable<DSpaceObjectSelect<Item>[]>;

  authorMetadata = environment.searchResult.authorMetadata;

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
