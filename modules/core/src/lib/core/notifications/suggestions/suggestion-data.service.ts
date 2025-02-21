import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../../cache';
import { RequestParam } from '../../cache';
import { ObjectCacheService } from '../../cache';
import {
  DeleteData,
  DeleteDataImpl,
} from '../../data';
import { IdentifiableDataService } from '../../data';
import { SearchDataImpl } from '../../data';
import { FindListOptions } from '../../data';
import { FollowLinkConfig } from '../../data';
import { PaginatedList } from '../../data';
import { RemoteData } from '../../data';
import { RequestService } from '../../data';
import { HALEndpointService } from '../../shared';
import { NoContent } from '../../shared';
import { NotificationsService } from '../notifications.service';
import { Suggestion } from './models';

/**
 * The service handling all Suggestion Target REST requests.
 */
@Injectable({ providedIn: 'root' })
export class SuggestionDataService extends IdentifiableDataService<Suggestion>  {

  protected searchFindByTargetAndSourceMethod = 'findByTargetAndSource';

  private deleteData: DeleteData<Suggestion>;
  private searchData: SearchDataImpl<Suggestion>;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
  ) {
    super('suggestions', requestService, rdbService, objectCache, halService);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Used to delete Suggestion
   * @suggestionId
   */
  public deleteSuggestion(suggestionId: string): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(suggestionId);
  }

  /**
   * Return the list of Suggestion for a given target and source
   *
   * @param target
   *    The target for which to find suggestions.
   * @param source
   *    The source for which to find suggestions.
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<Suggestion>>>
   *    The list of Suggestion.
   */
  public getSuggestionsByTargetAndSource(
    target: string,
    source: string,
    options: FindListOptions = {},
    ...linksToFollow: FollowLinkConfig<Suggestion>[]
  ): Observable<RemoteData<PaginatedList<Suggestion>>> {
    options.searchParams = [
      new RequestParam('target', target),
      new RequestParam('source', source),
    ];

    return this.searchData.searchBy(this.searchFindByTargetAndSourceMethod, options, false, true, ...linksToFollow);
  }

  /**
   * Clear findByTargetAndSource suggestions requests from cache
   */
  public clearSuggestionRequests() {
    this.requestService.setStaleByHrefSubstring(this.searchFindByTargetAndSourceMethod);
  }
}
