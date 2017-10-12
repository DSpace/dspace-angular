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
    this.cds.getEndpoint()
      .map((endpoint: string) => this.cds.getFindByIDHref(endpoint, scopeID))
      .filter((href: string) => isNotEmpty(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new FindByIDRequest(href, scopeID);
        setTimeout(() => {
          this.requestService.configure(request);
        }, 0);
      });

    return this.objectCache.getByUUID(scopeID, NormalizedCommunity)
      .map((nc: NormalizedCommunity) => nc._links[this.linkName])
      .filter((href) => isNotEmpty(href))
      .distinctUntilChanged();
  }
}
