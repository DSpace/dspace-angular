import { Component, OnInit } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { ObjectSelectComponent } from '../object-select/object-select.component';
import { isNotEmpty, hasValueOperator } from '../../empty.util';
import { Observable } from 'rxjs';
import { DSpaceObjectSelect } from '../object-select.model';
import { getAllSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';

@Component({
  selector: 'ds-collection-select',
  templateUrl: './collection-select.component.html',
  styleUrls: ['./collection-select.component.scss'],
})

/**
 * A component used to select collections from a specific list and returning the UUIDs of the selected collections
 */
export class CollectionSelectComponent extends ObjectSelectComponent<Collection> implements OnInit {

  /**
   * Collection of all the data that is used to display the {@link Collection} in the HTML.
   * By collecting this data here it doesn't need to be recalculated on evey change detection.
   */
  selectCollections$: Observable<DSpaceObjectSelect<Collection>[]>;

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'collection.select.confirm';
    }
    this.selectCollections$ = this.dsoRD$.pipe(
      hasValueOperator(),
      getAllSucceededRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections.page.map((collection: Collection) => Object.assign(new DSpaceObjectSelect<Collection>(), {
        dso: collection,
        canSelect$: this.canSelect(collection),
        selected$: this.getSelected(collection.id),
        route: getCollectionPageRoute(collection.id),
      } as DSpaceObjectSelect<Collection>))),
    );
  }

}
