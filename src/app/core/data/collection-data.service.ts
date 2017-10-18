import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataService } from './data.service';
import { Collection } from '../shared/collection.model';
import { ResponseCacheService } from '../cache/response-cache.service';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { CoreState } from '../core.reducers';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { Observable } from 'rxjs/Observable';
import { CommunityDataService } from './community-data.service';
import { FindByIDRequest } from './request.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { DSOSuccessResponse, RestResponse } from '../cache/response-cache.models';

@Injectable()
export class CollectionDataService extends DataService<NormalizedCollection, Collection> {
  protected linkName = 'collections';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    private cds: CommunityDataService,
    protected objectCache: ObjectCacheService
  ) {
    super(NormalizedCollection);
  }

  /**
   * Get the scoped endpoint URL by fetching the object with
   * the given scopeID and returning its HAL link with this
   * data-service's linkName
   *
   * @param {string} scopeID
   *    the id of the scope object
   * @return { Observable<string> }
   *    an Observable<string> containing the scoped URL
   */
  public getScopedEndpoint(scopeID: string): Observable<string> {
    const scopeCommunityHrefObs = this.cds.getEndpoint()
      .flatMap((endpoint: string) => this.cds.getFindByIDHref(endpoint, scopeID))
      .filter((href: string) => isNotEmpty(href))
      .take(1)
      .do((href: string) => {
        const request = new FindByIDRequest(href, scopeID);
        setTimeout(() => {
          this.requestService.configure(request);
        }, 0);
      });

    const [successResponse, errorResponse] = scopeCommunityHrefObs
      .flatMap((href: string) => this.responseCache.get(href))
      .map((entry: ResponseCacheEntry) => entry.response)
      .share()
      .partition((response: RestResponse) => response.isSuccessful);

    return Observable.merge(
      errorResponse.flatMap((response: DSOSuccessResponse) =>
        Observable.throw(new Error(`The Community with scope ${scopeID} couldn't be retrieved`))),
      successResponse
        .flatMap((response: DSOSuccessResponse) => this.objectCache.getByUUID(scopeID, NormalizedCommunity))
        .map((nc: NormalizedCommunity) => nc._links[this.linkName])
        .filter((href) => isNotEmpty(href))
    ).distinctUntilChanged();
  }
}
