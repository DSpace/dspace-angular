import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RemoteData} from '../core/data/remote-data';
import {PaginatedList} from '../core/data/paginated-list.model';
import {SearchResult} from '../shared/search/search-result.model';
import {DSpaceObject} from '../core/shared/dspace-object.model';
import {PaginatedSearchOptions} from '../shared/search/paginated-search-options.model';
import {SearchService} from '../core/shared/search/search.service';

@Injectable({
  providedIn: 'root'
})
export class LuckySearchService {

  constructor(private searchService: SearchService) {
  }

  /**
   * @returns {string} The base path to the search page
   */
  getSearchLink(): string {
    return 'lucky-search';
  }

  sendRequest(paginatedSearchOptions: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const paginatedSearchOptionsNew = Object.assign(new PaginatedSearchOptions({}), paginatedSearchOptions, {
      configuration: this.getSearchLink()
    });
    return this.searchService.search(paginatedSearchOptionsNew);
  }
}
