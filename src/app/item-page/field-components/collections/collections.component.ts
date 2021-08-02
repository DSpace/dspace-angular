import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { PaginatedList, buildPaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';

import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { hasValue } from '../../../shared/empty.util';

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
        if (hasValue(rd.payload)) {
          return new RemoteData(
            rd.timeCompleted,
            rd.msToLive,
            rd.lastUpdated,
            rd.state,
            rd.errorMessage,
            buildPaginatedList({
              elementsPerPage: 10,
              totalPages: 1,
              currentPage: 1,
              totalElements: 1,
              _links: {
                self: rd.payload._links.self
              }
            } as PageInfo, [rd.payload]),
            rd.statusCode
          );
        } else {
          return rd as any;
        }
      })
    );
  }
}
