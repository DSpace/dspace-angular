import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchService } from '../../core/shared/search/search.service';
import { hasValue } from '../../shared/empty.util';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { getFirstSucceededRemoteData } from './../../core/shared/operators';

/**
 * Service that handle profiles claim.
 */
@Injectable()
export class ProfileClaimService {

  constructor(private searchService: SearchService,
    private configurationService: ConfigurationDataService) {
  }

  /**
   * Returns true if it is possible to suggest profiles to be claimed to the given eperson.
   *
   * @param eperson the eperson
   */
  canClaimProfiles(eperson: EPerson): Observable<boolean> {

    const query = this.personQueryData(eperson);

    if (!hasValue(query) || query.length === 0) {
      return of(false);
    }

    return this.lookup(query).pipe(
      mergeMap((rd: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => of(rd.payload.totalElements > 0))
    );

  }

  /**
   * Returns profiles that could be associated with the given user.
   * @param eperson the user
   */
  search(eperson: EPerson): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const query = this.personQueryData(eperson);
    if (!hasValue(query) || query.length === 0) {
      return of(null);
    }
    return this.lookup(query);
  }

  /**
   * Search object by the given query.
   * @param query the query for the search
   */
  private lookup(query: string): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    if (!hasValue(query)) {
      return of(null);
    }
    return this.searchService.search(new PaginatedSearchOptions({
      configuration: 'eperson_claims',
      query: query
    }))
    .pipe(
      getFirstSucceededRemoteData(),
      take(1));
  }

  private personQueryData(eperson: EPerson): string {
    return 'dc.title:' + eperson.name;
  }

}
