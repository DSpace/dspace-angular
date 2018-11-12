import { distinctUntilChanged, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { merge as observableMerge, Observable, throwError as observableThrowError } from 'rxjs';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { CommunityDataService } from './community-data.service';

import { DataService } from './data.service';
import { FindAllOptions, FindByIDRequest } from './request.models';
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
  public getBrowseEndpoint(options: FindAllOptions = {}): Observable<string> {
    if (isEmpty(options.scopeID)) {
      return this.halService.getEndpoint(this.linkPath);
    } else {
      const scopeCommunityHrefObs = this.cds.getEndpoint().pipe(
        mergeMap((endpoint: string) => this.cds.getFindByIDHref(endpoint, options.scopeID)),
        filter((href: string) => isNotEmpty(href)),
        take(1),
        tap((href: string) => {
          const request = new FindByIDRequest(this.requestService.generateRequestId(), href, options.scopeID);
          this.requestService.configure(request);
        }),);

      // return scopeCommunityHrefObs.pipe(
      //   mergeMap((href: string) => this.responseCache.get(href)),
      //   map((entry: ResponseCacheEntry) => entry.response),
      //   mergeMap((response) => {
      //     if (response.isSuccessful) {
      //       const community$: Observable<NormalizedCommunity> = this.objectCache.getByUUID(scopeID);
      //       return community$.pipe(
      //         map((community) => community._links[this.linkPath]),
      //         filter((href) => isNotEmpty(href)),
      //         distinctUntilChanged()
      //       );
      //     } else if (!response.isSuccessful) {
      //       return observableThrowError(new Error(`The Community with scope ${scopeID} couldn't be retrieved`))
      //     }
      //   }),
      //   distinctUntilChanged()
      // );
      const responses = scopeCommunityHrefObs.pipe(
        mergeMap((href: string) => this.responseCache.get(href)),
        map((entry: ResponseCacheEntry) => entry.response));
      const errorResponses = responses.pipe(
        filter((response) => !response.isSuccessful),
        mergeMap(() => observableThrowError(new Error(`The Community with scope ${options.scopeID} couldn't be retrieved`)))
      );
      const successResponses = responses.pipe(
        filter((response) => response.isSuccessful),
        mergeMap(() => this.objectCache.getByUUID(options.scopeID)),
        map((nc: NormalizedCommunity) => nc._links[this.linkPath]),
        filter((href) => isNotEmpty(href))
      );

      return observableMerge(errorResponses, successResponses).pipe(distinctUntilChanged());
    }
  }
}
