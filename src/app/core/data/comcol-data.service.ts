import { Observable, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { CommunityDataService } from './community-data.service';

import { DataService } from './data.service';
import { FindByIDRequest } from './request.models';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';

export abstract class ComColDataService<TNormalized extends NormalizedObject, TDomain> extends DataService<TNormalized, TDomain> {
  protected abstract cds: CommunityDataService;
  protected abstract objectCache: ObjectCacheService;
  protected abstract halService: HALEndpointService;

  /**
   * Get the scoped endpoint URL by fetching the object with
   * the given scopeID and returning its HAL link with this
   * data-service's linkPath
   *
   * @param {string} scopeID
   *    the id of the scope object
   * @return { Observable<string> }
   *    an Observable<string> containing the scoped URL
   */
  public getScopedEndpoint(scopeID: string): Observable<string> {
    if (isEmpty(scopeID)) {
      return this.halService.getEndpoint(this.linkPath);
    } else {
      const scopeCommunityHrefObs = this.cds.getEndpoint().pipe(
        mergeMap((endpoint: string) => this.cds.getFindByIDHref(endpoint, scopeID)),
        first((href: string) => isNotEmpty(href)),
        tap((href: string) => {
          const request = new FindByIDRequest(this.requestService.generateRequestId(), href, scopeID);
          this.requestService.configure(request);
        }),);

      return scopeCommunityHrefObs.pipe(
        mergeMap((href: string) => this.responseCache.get(href)),
        map((entry: ResponseCacheEntry) => entry.response),
        mergeMap((response) => {
          if (response.isSuccessful) {
            const community$: Observable<NormalizedCommunity> = this.objectCache.getByUUID(scopeID);
            return community$.pipe(
              map((community) => community._links[this.linkPath]),
              filter((href) => isNotEmpty(href)),
              distinctUntilChanged()
            );
          } else if (!response.isSuccessful) {
            return observableThrowError(new Error(`The Community with scope ${scopeID} couldn't be retrieved`))
          }
        }),
        distinctUntilChanged()
      );
    }
  }
}
