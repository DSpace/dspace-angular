import { Observable } from 'rxjs/Observable';
import { isEmpty, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOSuccessResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { CommunityDataService } from './community-data.service';

import { DataService } from './data.service';
import { FindByIDRequest, PostRequest, PutRequest } from './request.models';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Community } from '../shared/community.model';
import { Collection } from '../shared/collection.model';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { configureRequest } from '../shared/operators';
import { AuthService } from '../auth/auth.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { HttpHeaders } from '@angular/common/http';

export abstract class ComColDataService<TNormalized extends NormalizedObject, TDomain>  extends DataService<TNormalized, TDomain> {
  protected abstract cds: CommunityDataService;
  protected abstract objectCache: ObjectCacheService;
  protected abstract halService: HALEndpointService;
  protected abstract authService: AuthService;

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
      const scopeCommunityHrefObs = this.cds.getEndpoint()
        .flatMap((endpoint: string) => this.cds.getFindByIDHref(endpoint, scopeID))
        .filter((href: string) => isNotEmpty(href))
        .take(1)
        .do((href: string) => {
          const request = new FindByIDRequest(this.requestService.generateRequestId(), href, scopeID);
          this.requestService.configure(request);
        });

      const [successResponse, errorResponse] = scopeCommunityHrefObs
        .flatMap((href: string) => this.responseCache.get(href))
        .map((entry: ResponseCacheEntry) => entry.response)
        .share()
        .partition((response: RestResponse) => response.isSuccessful);

      return Observable.merge(
        errorResponse.flatMap((response: ErrorResponse) =>
          Observable.throw(new Error(`The Community with scope ${scopeID} couldn't be retrieved`))),
        successResponse
          .flatMap((response: DSOSuccessResponse) => this.objectCache.getByUUID(scopeID))
          .map((nc: NormalizedCommunity) => nc._links[this.linkPath])
          .filter((href) => isNotEmpty(href))
      ).distinctUntilChanged();
    }
  }

  public create(comcol: TDomain) {
    this.halService.getEndpoint(this.linkPath).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        const headers = new HttpHeaders();
        headers.append('Authentication', this.authService.buildAuthHeader());
        options.headers = headers;
        return new PostRequest(this.requestService.generateRequestId(), endpointURL + this.buildCreateParams(comcol));
      }),
      configureRequest(this.requestService)
    ).subscribe();
  }

  abstract buildCreateParams(comcol: TDomain): string;

}
