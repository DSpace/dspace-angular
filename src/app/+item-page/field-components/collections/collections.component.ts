import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';

import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { PageInfo } from '../../../core/shared/page-info.model';

/**
 * This component renders the parent collections section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
  selector: 'ds-item-page-collections',
  templateUrl: './collections.component.html'
})
export class CollectionsComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.collections';

  separator = '<br/>';

  collectionsRD$: Observable<RemoteData<PaginatedList<Collection>>>;

  constructor(private cds: CollectionDataService) {

  }

  ngOnInit(): void {
    //   this.collections = this.item.parents.payload;

    // TODO: this should use parents, but the collections
    // for an Item aren't returned by the REST API yet,
    // only the owning collection
    this.collectionsRD$ = this.cds.findOwningCollectionFor(this.item).pipe(
      map((rd: RemoteData<Collection>) => {
        if (rd.hasSucceeded) {
          return new RemoteData(
            false,
            false,
            true,
            undefined,
            new PaginatedList({
              elementsPerPage: 10,
              totalPages: 1,
              currentPage: 1,
              totalElements: 1
            } as PageInfo, [rd.payload])
          );
        } else {
          return rd as any;
        }
      })
    );
  }
}
