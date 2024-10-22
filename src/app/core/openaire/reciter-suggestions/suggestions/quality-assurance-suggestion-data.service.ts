import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../data/base/data-service.decorator';
import { RequestService } from '../../../data/request.service';
import { RemoteData } from '../../../data/remote-data';
import { OpenaireSuggestion } from '../models/openaire-suggestion.model';
import { SUGGESTION } from '../models/openaire-suggestion-objects.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { FindListOptions } from '../../../data/find-list-options.model';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';
import { FindAllData, FindAllDataImpl } from '../../../data/base/find-all-data';
import { RequestParam } from '../../../cache/models/request-param.model';
import { SearchData, SearchDataImpl } from '../../../data/base/search-data';
import { OpenaireSuggestionSource } from '../models/openaire-suggestion-source.model';
import { DeleteData, DeleteDataImpl } from '../../../data/base/delete-data';
import { NoContent } from '../../../shared/NoContent.model';

/**
 * The service handling all Quality Assurance source REST requests.
 */
@Injectable()
@dataService(SUGGESTION)
export class QualityAssuranceSuggestionDataService extends IdentifiableDataService<OpenaireSuggestion> {

  protected searchFindByTargetAndSourceMethod = 'findByTargetAndSource';

  private deleteData: DeleteData<OpenaireSuggestion>;
  private findAllData: FindAllData<OpenaireSuggestion>;
  private searchData: SearchData<OpenaireSuggestion>;

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
    super('suggestions', requestService, rdbService, objectCache, halService);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Clear findByTargetAndSource suggestions requests from cache
   */
  public clearSuggestionRequestsCache() {
    this.requestService.setStaleByHrefSubstring(this.searchFindByTargetAndSourceMethod);
  }

  /**
   * Delete a Suggestion by given id
   *
   * @suggestionId  The suggestion id to delete
   */
  public deleteSuggestion(suggestionId: string): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(suggestionId);
  }

  public deleteSuggestionAsync(suggestionId: string): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteAsync(suggestionId);
  }


  /**
   * Return a Suggestion for a given user id
   *
   * @param id                          The user id to retrieve.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid-cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested
   *                                    after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<OpenaireSuggestionTarget>>
   *    The list of Suggestion Target.
   */
  public getSuggestion(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<OpenaireSuggestionSource>[]): Observable<RemoteData<OpenaireSuggestion>> {
    return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale);
  }

  /**
   * Return the list of Suggestion Target for a given source
   *
   * @param target                      The target for which to find suggestions.
   * @param source                      The source for which to find suggestions.
   * @param options                     Find list options object.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid-cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestion>>>
   *    The list of Suggestion.
   */
  public getSuggestionsByTargetAndSource(
    target: string,
    source: string,
    options: FindListOptions = {},
    useCachedVersionIfAvailable = true,
    reRequestOnStale = true,
    ...linksToFollow: FollowLinkConfig<OpenaireSuggestion>[]
  ): Observable<RemoteData<PaginatedList<OpenaireSuggestion>>> {
    options.searchParams = [
      new RequestParam('target', target, false),
      new RequestParam('source', source, false)
    ];

    return this.searchData.searchBy(this.searchFindByTargetAndSourceMethod, options, true, true, ...linksToFollow);
  }

}
