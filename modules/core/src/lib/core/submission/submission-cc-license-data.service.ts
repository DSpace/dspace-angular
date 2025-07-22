import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService , ObjectCacheService } from '../cache';
import { BaseDataService ,
  FindAllData,
  FindAllDataImpl,
, FindListOptions , FollowLinkConfig , PaginatedList , RemoteData , RequestService } from '../data';
import { HALEndpointService } from '../shared';
import { SubmissionCcLicence } from './models';

@Injectable({ providedIn: 'root' })
export class SubmissionCcLicenseDataService extends BaseDataService<SubmissionCcLicence> implements FindAllData<SubmissionCcLicence> {

  protected linkPath = 'submissioncclicenses';
  private findAllData: FindAllData<SubmissionCcLicence>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissioncclicenses', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
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
  public findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<SubmissionCcLicence>[]): Observable<RemoteData<PaginatedList<SubmissionCcLicence>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
