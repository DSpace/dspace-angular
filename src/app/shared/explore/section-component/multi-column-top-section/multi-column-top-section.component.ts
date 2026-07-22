import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SearchManager } from '@dspace/core/browse/search-manager';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import {
  MultiColumnTopSection,
  TopSectionColumn,
} from '@dspace/core/layout/models/section.model';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import { Metadata } from '@dspace/core/shared/metadata.utils';
import { getFirstSucceededRemoteDataPayload } from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * Component that displays a table of top items from a discovery search,
 * with configurable columns showing different metadata fields per item.
 */
@Component({
  selector: 'ds-base-multi-column-top-section',
  templateUrl: './multi-column-top-section.component.html',
})
export class MultiColumnTopSectionComponent implements OnInit {

  /** Unique identifier for this section instance. */
  @Input()
    sectionId: string;

  /** Configuration object defining discovery query, sort, and column layout. */
  @Input()
    topSection: MultiColumnTopSection;

  /** Observable emitting the array of top DSpaceObjects fetched from the search. */
  topObjects: Observable<DSpaceObject[]>;

  constructor(private searchService: SearchManager) {

  }

  ngOnInit() {
    const order = this.topSection.order;
    const sortDirection = order && order.toUpperCase() === 'ASC' ? SortDirection.ASC : SortDirection.DESC;
    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'search-object-pagination',
      pageSize: 50,
      currentPage: 1,
    });

    this.topObjects = this.searchService.search(new PaginatedSearchOptions({
      configuration: this.topSection.discoveryConfigurationName,
      pagination: pagination,
      sort: new SortOptions(this.topSection.sortField, sortDirection),
    })).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((response: SearchObjects<DSpaceObject>) => response.page
        .map((searchResult: SearchResult<DSpaceObject>) => searchResult._embedded.indexableObject),
      ),
    );
  }


  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: DSpaceObject): string {
    return getItemPageRoute((item as Item));
  }

  /**
   * Returns the configured column definitions for the table.
   */
  getColumns(): TopSectionColumn[] {
    return this.topSection.columnList;
  }

  /**
   * Returns the first metadata value for a given column's metadata field on the object.
   *
   * @param topObject the DSpace object (item) to extract metadata from
   * @param column the column definition specifying which metadata field to read
   */
  getColumnValue(topObject: DSpaceObject, column: TopSectionColumn): string {
    return Metadata.firstValue(topObject.metadata, column.metadataField);
  }
}
