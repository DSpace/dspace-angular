import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Operation } from 'fast-json-patch';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { Site } from '../shared/site.model';
import { SITE } from '../shared/site.resource-type';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { RequestParam } from '../cache/models/request-param.model';
import { FindAllData, FindAllDataImpl } from './base/find-all-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { FindListOptions } from './find-list-options.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { dataService } from './base/data-service.decorator';
import { PatchData, PatchDataImpl } from './base/patch-data';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { IdentifiableDataService } from './base/identifiable-data.service';

/**
 * Service responsible for handling requests related to the Site object
 */
@Injectable()
@dataService(SITE)
export class SiteDataService extends IdentifiableDataService<Site> implements FindAllData<Site> {
  private findAllData: FindAllData<Site>;
  private patchData: PatchData<Site>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected comparator: DefaultChangeAnalyzer<Site>
  ) {
    super('sites', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.patchData = new PatchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, comparator, this.responseMsToLive, this.constructIdEndpoint);
  }

  /**
   * Retrieve the Site Object
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
  find(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Site>[]): Observable<Site> {
    const searchParams: RequestParam[] = [new RequestParam('projection', 'allLanguages')];
    const findOptions = Object.assign(new FindListOptions(), options, { searchParams });
    return this.findAll(findOptions, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getFirstCompletedRemoteData(),
      switchMap((remoteData: RemoteData<PaginatedList<Site>>) => {
        if (remoteData.hasSucceeded) {
          return of(remoteData.payload.page[0]);
        } else {
          return this.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
            getFirstCompletedRemoteData(),
            map((rd: RemoteData<PaginatedList<Site>>) => rd.hasSucceeded ? rd.payload.page[0] : null)
          );
        }
      })
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
