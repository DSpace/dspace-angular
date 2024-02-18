import { Injectable } from '@angular/core';
import { dataService } from '../../data/base/data-service.decorator';

import { IdentifiableDataService } from '../../data/base/identifiable-data.service';
import { SuggestionTarget } from '../models/suggestion-target.model';
import { FindAllData, FindAllDataImpl } from '../../data/base/find-all-data';
import { Store } from '@ngrx/store';
import { RequestService } from '../../data/request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { CoreState } from '../../core-state.model';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { FindListOptions } from '../../data/find-list-options.model';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../data/paginated-list.model';
import { RemoteData } from '../../data/remote-data';
import { Observable } from 'rxjs/internal/Observable';
import { RequestParam } from '../../cache/models/request-param.model';
import { SearchData, SearchDataImpl } from '../../data/base/search-data';
import { DefaultChangeAnalyzer } from '../../data/default-change-analyzer.service';
import { SUGGESTION_TARGET } from '../models/suggestion-target-object.resource-type';

@Injectable()
@dataService(SUGGESTION_TARGET)
export class SuggestionTargetDataService extends IdentifiableDataService<SuggestionTarget> {

  protected linkPath = 'suggestiontargets';
  private findAllData: FindAllData<SuggestionTarget>;
  private searchData: SearchData<SuggestionTarget>;
  protected searchFindBySourceMethod = 'findBySource';
  protected searchFindByTargetMethod = 'findByTarget';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<SuggestionTarget>) {
    super('suggestiontargets', requestService, rdbService, objectCache, halService);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }
  /**
   * Return the list of Suggestion Target for a given source
   *
   * @param source
   *    The source for which to find targets.
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<SuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  public getTargets(
    source: string,
    options: FindListOptions = {},
    ...linksToFollow: FollowLinkConfig<SuggestionTarget>[]
  ): Observable<RemoteData<PaginatedList<SuggestionTarget>>> {
    options.searchParams = [new RequestParam('source', source)];

    return this.searchBy(this.searchFindBySourceMethod, options, true, true, ...linksToFollow);
  }

  /**
   * Return the list of Suggestion Target for a given user
   *
   * @param userId
   *    The user Id for which to find targets.
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<SuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  public getTargetsByUser(
    userId: string,
    options: FindListOptions = {},
    ...linksToFollow: FollowLinkConfig<SuggestionTarget>[]
  ): Observable<RemoteData<PaginatedList<SuggestionTarget>>> {
    options.searchParams = [new RequestParam('target', userId)];

    return this.searchBy(this.searchFindByTargetMethod, options, true, true, ...linksToFollow);
  }
  /**
   * Return a Suggestion Target for a given id
   *
   * @param targetId
   *    The target id to retrieve.
   *
   * @return Observable<RemoteData<SuggestionTarget>>
   *    The list of Suggestion Target.
   */
  public getTargetById(targetId: string): Observable<RemoteData<SuggestionTarget>> {
    return this.findById(targetId);
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod                The search method for the object
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<SuggestionTarget>[]): Observable<RemoteData<PaginatedList<SuggestionTarget>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
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
  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<SuggestionTarget>[]): Observable<RemoteData<PaginatedList<SuggestionTarget>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

}
