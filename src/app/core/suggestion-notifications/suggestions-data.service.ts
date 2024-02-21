/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { dataService } from '../cache/builders/build-decorators';
import { RequestService } from '../data/request.service';
import { UpdateDataServiceImpl } from '../data/update-data.service';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { RemoteData } from '../data/remote-data';
import { SUGGESTION } from './models/suggestion-objects.resource-type';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../data/paginated-list.model';
import { SuggestionSource } from './models/suggestion-source.model';
import { SuggestionTarget } from './models/suggestion-target.model';
import { Suggestion } from './models/suggestion.model';
import { RequestParam } from '../cache/models/request-param.model';
import { NoContent } from '../shared/NoContent.model';
import {CoreState} from '../core-state.model';
import {FindListOptions} from '../data/find-list-options.model';
import { SuggestionSourceDataService } from './source/suggestion-source-data.service';
import { SuggestionTargetDataService } from './target/suggestion-target-data.service';

/* tslint:disable:max-classes-per-file */

/**
 * A private UpdateDataServiceImpl implementation to delegate specific methods to.
 */
export class SuggestionDataServiceImpl extends UpdateDataServiceImpl<Suggestion> {

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<Suggestion>} comparator
   * @param responseMsToLive
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<Suggestion>,
    protected responseMsToLive: number,
  ) {
    super('suggestions', requestService, rdbService, objectCache, halService, notificationsService, comparator ,responseMsToLive);
  }
}

/**
 * The service handling all Suggestion Target REST requests.
 */
@Injectable()
@dataService(SUGGESTION)
export class SuggestionsDataService {
  protected searchFindBySourceMethod = 'findBySource';
  protected searchFindByTargetAndSourceMethod = 'findByTargetAndSource';

  /**
   * A private UpdateDataServiceImpl implementation to delegate specific methods to.
   */
  private suggestionsDataService: SuggestionDataServiceImpl;

  /**
   * A private UpdateDataServiceImpl implementation to delegate specific methods to.
   */
  private suggestionSourcesDataService: SuggestionSourceDataService;

  /**
   * A private UpdateDataServiceImpl implementation to delegate specific methods to.
   */
  private suggestionTargetsDataService: SuggestionTargetDataService;

  private responseMsToLive = 10 * 1000;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {DefaultChangeAnalyzer<Suggestion>} comparatorSuggestions
   * @param {DefaultChangeAnalyzer<SuggestionSource>} comparatorSources
   * @param {DefaultChangeAnalyzer<SuggestionTarget>} comparatorTargets
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparatorSuggestions: DefaultChangeAnalyzer<Suggestion>,
    protected comparatorSources: DefaultChangeAnalyzer<SuggestionSource>,
    protected comparatorTargets: DefaultChangeAnalyzer<SuggestionTarget>,
  ) {
    this.suggestionsDataService = new SuggestionDataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparatorSuggestions, this.responseMsToLive);
    this.suggestionSourcesDataService = new SuggestionSourceDataService(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparatorSources);
    this.suggestionTargetsDataService = new SuggestionTargetDataService(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparatorTargets);
  }

  /**
   * Return the list of Suggestion Sources
   *
   * @param options
   *    Find list options object.
   * @return Observable<RemoteData<PaginatedList<SuggestionSource>>>
   *    The list of Suggestion Sources.
   */
  public getSources(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<SuggestionSource>>> {
    return this.suggestionSourcesDataService.getSources(options);
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

    return this.suggestionTargetsDataService.getTargets(this.searchFindBySourceMethod, options, ...linksToFollow);
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
    return this.suggestionTargetsDataService.getTargetsByUser(userId, options, ...linksToFollow);
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
    return this.suggestionTargetsDataService.findById(targetId);
  }

  /**
   * Used to delete Suggestion
   * @suggestionId
   */
  public deleteSuggestion(suggestionId: string): Observable<RemoteData<NoContent>> {
    return this.suggestionsDataService.delete(suggestionId);
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
      new RequestParam('source', source)
    ];

    return this.suggestionsDataService.searchBy(this.searchFindByTargetAndSourceMethod, options, false, true, ...linksToFollow);
  }

  /**
   * Clear findByTargetAndSource suggestions requests from cache
   */
  public clearSuggestionRequests() {
    this.requestService.setStaleByHrefSubstring(this.searchFindByTargetAndSourceMethod);
  }
}
