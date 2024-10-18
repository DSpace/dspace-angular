import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../data/base/data-service.decorator';
import { RequestService } from '../../../data/request.service';
import { RemoteData } from '../../../data/remote-data';
import { OpenaireSuggestionTarget } from '../models/openaire-suggestion-target.model';
import { SUGGESTION_TARGET } from '../models/openaire-suggestion-objects.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { FindListOptions } from '../../../data/find-list-options.model';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';
import { FindAllData, FindAllDataImpl } from '../../../data/base/find-all-data';

import { RequestParam } from '../../../cache/models/request-param.model';
import { SearchData, SearchDataImpl } from '../../../data/base/search-data';
import { OpenaireSuggestionSource } from '../models/openaire-suggestion-source.model';

/**
 * The service handling all Quality Assurance source REST requests.
 */
@Injectable()
@dataService(SUGGESTION_TARGET)
export class QualityAssuranceSuggestionTargetDataService extends IdentifiableDataService<OpenaireSuggestionTarget> {

  protected searchFindBySourceMethod = 'findBySource';
  protected searchFindByTargetMethod = 'findByTarget';

  private findAllData: FindAllData<OpenaireSuggestionTarget>;
  private searchData: SearchData<OpenaireSuggestionTarget>;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService
  ) {
    super('suggestiontargets', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Return a Suggestion Target for a given id
   *
   * @param id                          The target id to retrieve.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested
   *                                    after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<OpenaireSuggestionTarget>>
   *    The list of Suggestion Target.
   */
  public getTargetById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<OpenaireSuggestionSource>[]): Observable<RemoteData<OpenaireSuggestionTarget>> {
    return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale);
  }

  /**
   * Return the list of Suggestion Target for a given source
   *
   * @param source                      The source for which to find targets.
   * @param options                     Find list options object.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  public getTargetsBySource(
    source: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<OpenaireSuggestionTarget>[]
  ): Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>> {
    options.searchParams = [new RequestParam('source', source, false)];

    return this.searchData.searchBy(this.searchFindBySourceMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Return the list of Suggestion Target for a given user
   *
   * @param userId                      The user Id for which to find targets.
   * @param options                     Find list options object.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  public getTargetsByUser(
    userId: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<OpenaireSuggestionTarget>[]
  ): Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>> {
    options.searchParams = [new RequestParam('target', userId, false)];

    return this.searchData.searchBy(this.searchFindByTargetMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

}
