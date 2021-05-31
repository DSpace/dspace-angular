import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap, take } from 'rxjs/operators';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchService } from '../../core/shared/search/search.service';
import { hasValue } from '../../shared/empty.util';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { SearchResult } from '../../shared/search/search-result.model';
import { getFirstSucceededRemoteData, getFirstSucceededRemoteDataPayload } from './../../core/shared/operators';

@Injectable()
export class ProfileClaimService {

  constructor(private searchService: SearchService,
    private configurationService: ConfigurationDataService) {
  }

  canClaimProfiles(eperson: EPerson): Observable<boolean> {

    const query = this.personQueryData(eperson);

    if (!hasValue(query) || query.length === 0) {
      return of(false);
    }

    return this.configurationService.findByPropertyName('claimable.entityType').pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((claimableTypes) => {
        if (!claimableTypes.values || claimableTypes.values.length === 0) {
          return of(false);
        } else {
          return this.lookup(query).pipe(
            mergeMap((rd: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => of(rd.payload.totalElements > 0))
          );
        }
      })
    );
  }

  search(eperson: EPerson): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const query = this.personQueryData(eperson);
    if (!hasValue(query) || query.length === 0) {
      return of(null);
    }
    return this.lookup(query);
  }

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
    const querySections = [];
    this.queryParam(querySections, 'dc.title', eperson.name);
    this.queryParam(querySections, 'crisrp.name', eperson.name);
    return querySections.join(' OR ');
  }

  private queryParam(query: string[], metadata: string, value: string) {
    if (!hasValue(value)) {return;}
    query.push(metadata + ':' + value);
  }
}
