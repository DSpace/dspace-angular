import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Metadata } from '../../../../core/shared/metadata.utils';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { MultiColumnTopSection, TopSectionColumn } from '../../../../core/layout/models/section.model';
import { SearchResult } from '../../../search/models/search-result.model';
import { SearchObjects } from '../../../search/models/search-objects.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { PaginatedSearchOptions } from '../../../search/models/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../pagination/pagination-component-options.model';
import { SearchManager } from '../../../../core/browse/search-manager';
import { SortDirection, SortOptions } from '../../../../core/cache/models/sort-options.model';
import { getItemPageRoute } from '../../../../item-page/item-page-routing-paths';
import { Item } from '../../../../core/shared/item.model';

@Component({
  selector: 'ds-multi-column-top-section',
  templateUrl: './multi-column-top-section.component.html'
})
export class MultiColumnTopSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  topSection: MultiColumnTopSection;

  topObjects: Observable<DSpaceObject[]>;

  constructor(private searchService: SearchManager) {

  }

  ngOnInit() {
    const order = this.topSection.order;
    const sortDirection = order && order.toUpperCase() === 'ASC' ? SortDirection.ASC : SortDirection.DESC;
    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'search-object-pagination',
      pageSize: 50,
      currentPage: 1
    });

    this.topObjects = this.searchService.search(new PaginatedSearchOptions({
      configuration: this.topSection.discoveryConfigurationName,
      pagination: pagination,
      sort: new SortOptions(this.topSection.sortField, sortDirection)
    })).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((response: SearchObjects<DSpaceObject>) => response.page
        .map((searchResult: SearchResult<DSpaceObject>) => searchResult._embedded.indexableObject)
      )
    );
  }


  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: DSpaceObject): string {
    return getItemPageRoute((item as Item));
  }

  getColumns(): TopSectionColumn[] {
    return this.topSection.columnList;
  }

  getColumnValue(topObject: DSpaceObject, column: TopSectionColumn): string {
    return Metadata.firstValue(topObject.metadata, column.metadataField);
  }
}
