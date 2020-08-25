import { Component, OnInit, Input } from '@angular/core';
import { TopSection } from 'src/app/core/layout/models/section.model';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { PaginatedSearchOptions } from 'src/app/shared/search/paginated-search-options.model';
import { SortOptions, SortDirection } from 'src/app/core/cache/models/sort-options.model';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { filter, map, tap } from 'rxjs/operators';
import { RequestEntry } from 'src/app/core/data/request.reducer';
import { SearchResult } from 'src/app/shared/search/search-result.model';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { SearchQueryResponse } from 'src/app/shared/search/search-query-response.model';
import { Observable } from 'rxjs';
import { getItemPageRoute } from 'src/app/+item-page/item-page-routing.module';

/**
 * Component representing the Top component section.
 */
@Component({
    selector: 'ds-top-section',
    templateUrl: './top-section.component.html'
})
export class TopSectionComponent implements OnInit {

    @Input()
    sectionId: string;

    @Input()
    topSection: TopSection;

    topObjects: Observable<DSpaceObject[]>;

    constructor(private searchService: SearchService) {

    }

    ngOnInit() {

        const order = this.topSection.order;
        const sortDirection = order && order.toUpperCase() === 'ASC' ? SortDirection.ASC : SortDirection.DESC;
        const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
            id: 'search-object-pagination',
            pageSize: 5,
            currentPage: 1
          });

        this.topObjects = this.searchService.searchEntries(new PaginatedSearchOptions({
            configuration: this.topSection.discoveryConfigurationName,
            pagination: pagination,
            sort: new SortOptions(this.topSection.sortField, sortDirection)
        })).pipe(
            filter((result) => result.requestEntry && !result.requestEntry.responsePending),
            map( (result) => result.requestEntry.response),
            filter((response) => response.isSuccessful),
            map<any, SearchQueryResponse>((response) => response.results),
            map( (queryResponse) => queryResponse.objects.map((searchResult) => searchResult._embedded.indexableObject) )
        );
    }

    /**
     * Get the item page url
     * @param id The item id for which the url is requested
     */
    getItemPage(id: string): string {
        return getItemPageRoute(id);
    }
}
