import { Observable } from 'rxjs/Observable';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { CommunityDataService } from './community-data.service';

import { DataService } from './data.service';
import { FindAllOptions, FindByIDRequest } from './request.models';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';

export abstract class ComColDataService<TNormalized extends NormalizedObject, TDomain>  extends DataService<TNormalized, TDomain> {
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
      const scopeCommunityHrefObs = this.cds.getEndpoint()
        .flatMap((endpoint: string) => this.cds.getFindByIDHref(endpoint, options.scopeID))
        .filter((href: string) => isNotEmpty(href))
        .take(1)
        .do((href: string) => {
          const request = new FindByIDRequest(this.requestService.generateRequestId(), href, options.scopeID);
          this.requestService.configure(request);
        });

      const [successResponse, errorResponse] = scopeCommunityHrefObs
        .flatMap((href: string) => this.responseCache.get(href))
        .map((entry: ResponseCacheEntry) => entry.response)
        .share()
        .partition((response: RestResponse) => response.isSuccessful);

      return Observable.merge(
        errorResponse.flatMap((response: ErrorResponse) =>
          Observable.throw(new Error(`The Community with scope ${options.scopeID} couldn't be retrieved`))),
        successResponse
          .flatMap((response: DSOSuccessResponse) => this.objectCache.getByUUID(options.scopeID))
          .map((nc: NormalizedCommunity) => nc._links[this.linkPath])
          .filter((href) => isNotEmpty(href))
      ).distinctUntilChanged();
    }
  }
}
