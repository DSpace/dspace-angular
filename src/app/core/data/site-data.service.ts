import { Injectable } from '@angular/core';
import { FollowLinkConfig } from '@dspace/core/shared/follow-link-config.model';
import { Operation } from 'fast-json-patch/module/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstSucceededRemoteData } from '../shared/operators';
import { Site } from '../shared/site.model';
import { BaseDataService } from './base/base-data.service';
import {
  FindAllData,
  FindAllDataImpl,
} from './base/find-all-data';
import { constructIdEndpointDefault } from './base/identifiable-data.service';
import {
  PatchData,
  PatchDataImpl,
} from './base/patch-data';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions } from './find-list-options.model';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

/**
 * Service responsible for handling requests related to the Site object
 */
@Injectable({ providedIn: 'root' })
export class SiteDataService extends BaseDataService<Site> implements FindAllData<Site> {
  private findAllData: FindAllData<Site>;
  private patchData: PatchData<Site>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected comparator: DefaultChangeAnalyzer<Site>,
  ) {
    super('sites', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.patchData = new PatchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, comparator, this.responseMsToLive, constructIdEndpointDefault);
  }

  /**
   * Retrieve the Site Object
   */
  find(): Observable<Site> {
    return this.findAll().pipe(
      getFirstSucceededRemoteData(),
      map((remoteData: RemoteData<PaginatedList<Site>>) => remoteData.payload),
      map((list: PaginatedList<Site>) => list.page[0]),
    );
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options                     Find list options object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>>}
   *    Return an observable that emits object list
   */
  public findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Site>[]): Observable<RemoteData<PaginatedList<Site>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Send a patch request for a specified object
   * @param {Site} object The object to send a patch request for
   * @param {Operation[]} operations The patch operations to be performed
   */
  patch(object: Site, operations: Operation[]): Observable<RemoteData<Site>> {
    return this.patchData.patch(object, operations);
  }

  /**
   * Set the processes stale
   */
  setStale(): Observable<boolean> {
    return this.requestService.setStaleByHrefSubstring(this.linkPath);
  }
}
