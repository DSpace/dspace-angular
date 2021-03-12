import { Metadata } from './../../../core/shared/metadata.utils';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { TopSectionColumn } from './../../../core/layout/models/section.model';
import { SearchResult } from '../../../shared/search/search-result.model';
import { SearchObjects } from '../../../shared/search/search-objects.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MultiColumnTopSection } from '../../../core/layout/models/section.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { map } from 'rxjs/operators';
import { getItemPageRoute } from '../../../+item-page/item-page-routing-paths';

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

  constructor(private searchService: SearchService) {

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
   * @param id The item id for which the url is requested
   */
  getItemPage(id: string): string {
    return getItemPageRoute(id);
  }

  getColumns(): TopSectionColumn[] {
    return this.topSection.columnList;
  }

  getColumnValue(topObject: DSpaceObject, column: TopSectionColumn): string {
    return Metadata.firstValue(topObject.metadata, column.metadataField);
  }
}
