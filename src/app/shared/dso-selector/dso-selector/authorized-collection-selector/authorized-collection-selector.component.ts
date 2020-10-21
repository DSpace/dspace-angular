import { Component } from '@angular/core';
import { DSOSelectorComponent } from '../dso-selector.component';
import { SearchService } from '../../../../core/shared/search/search.service';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { SearchResult } from '../../../search/search-result.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-authorized-collection-selector',
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
   * Perform a search for authorized collections with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   */
  search(query: string, page: number): Observable<PaginatedList<SearchResult<DSpaceObject>>> {
    return this.collectionDataService.getAuthorizedCollection(query, Object.assign({
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize
    })).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((list) => new PaginatedList(list.pageInfo, list.page.map((col) => Object.assign(new CollectionSearchResult(), { indexableObject: col }))))
    );
  }
}
