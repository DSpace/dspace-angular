import { Component } from '@angular/core';
import { DSOSelectorComponent } from '../dso-selector.component';
import { SearchService } from '../../../../core/shared/search/search.service';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { SearchResult } from '../../../search/search-result.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { buildPaginatedList, PaginatedList } from '../../../../core/data/paginated-list.model';
import { followLink } from '../../../utils/follow-link-config.model';

@Component({
  selector: 'ds-authorized-collection-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html'
})
/**
 * Component rendering a list of collections to select from
 */
export class AuthorizedCollectionSelectorComponent extends DSOSelectorComponent {
  constructor(protected searchService: SearchService,
              protected collectionDataService: CollectionDataService) {
    super(searchService);
  }

  /**
   * Get a query to send for retrieving the current DSO
   */
  getCurrentDSOQuery(): string {
    return this.currentDSOId;
  }

  /**
   * Perform a search for authorized collections with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   */
  search(query: string, page: number): Observable<PaginatedList<SearchResult<DSpaceObject>>> {
    return this.collectionDataService.getAuthorizedCollection(query, Object.assign({
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize
    }),true, false, followLink('parentCommunity')).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((list) => buildPaginatedList(list.pageInfo, list.page.map((col) => Object.assign(new CollectionSearchResult(), { indexableObject: col }))))
    );
  }
}
