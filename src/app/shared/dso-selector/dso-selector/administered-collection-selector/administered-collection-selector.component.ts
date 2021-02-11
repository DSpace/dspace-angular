import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { buildPaginatedList, PaginatedList } from '../../../../core/data/paginated-list.model';
import { FindListOptions } from '../../../../core/data/request.models';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { SearchResult } from '../../../search/search-result.model';
import { DSOSelectorComponent } from '../dso-selector.component';

@Component({
  selector: 'ds-administered-collection-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html'
})
/**
 * Component rendering a list of collections to select from
 */
export class AdministeredCollectionSelectorComponent extends DSOSelectorComponent {

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
   * Perform a search for administered collections with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   */
  search(query: string, page: number): Observable<PaginatedList<SearchResult<DSpaceObject>>> {
    const findOptions: FindListOptions = {
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize
    };

    return this.collectionDataService.getAdministeredCollection(query, findOptions).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((list) => buildPaginatedList(list.pageInfo, list.page.map((col) => Object.assign(new CollectionSearchResult(), { indexableObject: col }))))
    );
  }
}
