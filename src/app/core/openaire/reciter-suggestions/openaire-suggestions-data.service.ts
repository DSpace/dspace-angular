import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { CoreState } from '../../core.reducers';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { dataService } from '../../cache/builders/build-decorators';
import { RequestService } from '../../data/request.service';
import { FindListOptions } from '../../data/request.models';
import { DataService } from '../../data/data.service';
import { ChangeAnalyzer } from '../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../data/default-change-analyzer.service';
import { RemoteData } from '../../data/remote-data';
import { SUGGESTION_TARGET } from './models/openaire-suggestion-objects.resource-type';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../data/paginated-list';
import { OpenaireSuggestionSource } from './models/openaire-suggestion-source.model';
import { OpenaireSuggestionTarget } from './models/openaire-suggestion-target.model';
import { OpenaireSuggestion } from './models/openaire-suggestion.model';
import { RestResponse } from '../../cache/response.models';
import { RequestParam } from '../../cache/models/request-param.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class SuggestionDataServiceImpl extends DataService<OpenaireSuggestion> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'suggestions';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<OpenaireSuggestion>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<OpenaireSuggestion>) {
    super();
  }
}

/**
 * A private DataService implementation to delegate specific methods to.
 */
class SuggestionTargetsDataServiceImpl extends DataService<OpenaireSuggestionTarget> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'suggestiontargets';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<OpenaireSuggestionTarget>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<OpenaireSuggestionTarget>) {
    super();
  }
}

/**
 * A private DataService implementation to delegate specific methods to.
 */
class SuggestionSourcesDataServiceImpl extends DataService<OpenaireSuggestionSource> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'suggestionsources';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<OpenaireSuggestionSource>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<OpenaireSuggestionSource>) {
    super();
  }
}

/**
 * The service handling all Suggestion Target REST requests.
 */
@Injectable()
@dataService(SUGGESTION_TARGET)
export class OpenaireSuggestionsDataService {
  protected searchFindBySourceMethod = 'findBySource';
  protected searchFindByTargetMethod = 'findByTarget';
  protected searchFindByTargetAndSourceMethod = 'findByTargetAndSource';

  /**
   * A private DataService implementation to delegate specific methods to.
   */
  private suggestionsDataService: SuggestionDataServiceImpl;

  /**
   * A private DataService implementation to delegate specific methods to.
   */
  private suggestionSourcesDataService: SuggestionSourcesDataServiceImpl;

  /**
   * A private DataService implementation to delegate specific methods to.
   */
  private suggestionTargetsDataService: SuggestionTargetsDataServiceImpl;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {DefaultChangeAnalyzer<OpenaireSuggestion>} comparatorSuggestions
   * @param {DefaultChangeAnalyzer<OpenaireSuggestionSource>} comparatorSources
   * @param {DefaultChangeAnalyzer<OpenaireSuggestionTarget>} comparatorTargets
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparatorSuggestions: DefaultChangeAnalyzer<OpenaireSuggestion>,
    protected comparatorSources: DefaultChangeAnalyzer<OpenaireSuggestionSource>,
    protected comparatorTargets: DefaultChangeAnalyzer<OpenaireSuggestionTarget>,
  ) {
    this.suggestionsDataService = new SuggestionDataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparatorSuggestions);
    this.suggestionSourcesDataService = new SuggestionSourcesDataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparatorSources);
    this.suggestionTargetsDataService = new SuggestionTargetsDataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparatorTargets);
  }

  /**
   * Return the list of Suggestion Target
   *
   * @param options
   *    Find list options object.
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestionSource>>>
   *    The list of Suggestion Sources.
   */
  public getSources(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<OpenaireSuggestionSource>>> {
    return this.suggestionSourcesDataService.findAll(options)
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
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  public getTargets(
    source: string,
    options: FindListOptions = {},
    ...linksToFollow: Array<FollowLinkConfig<OpenaireSuggestionTarget>>
  ): Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>> {
    options.searchParams = [new RequestParam('source', source)];

    return this.suggestionTargetsDataService.searchBy(this.searchFindBySourceMethod, options, ...linksToFollow);
    // TEST
    /*    const pageInfo = new PageInfo({
          elementsPerPage: 10,
          totalElements: 6,
          totalPages: 1,
          currentPage: 0
        });
        const array = [
          suggestionTargetObjectBollini,
          suggestionTargetObjectDigilio
        ];
        const paginatedList = new PaginatedList(pageInfo, array);
        const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
        return observableOf(paginatedListRD);*/
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
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  public getTargetsByUser(
    userId: string,
    options: FindListOptions = {},
    ...linksToFollow: Array<FollowLinkConfig<OpenaireSuggestionTarget>>
  ): Observable<RemoteData<PaginatedList<OpenaireSuggestionTarget>>> {
    options.searchParams = [new RequestParam('target', userId)];

    return this.suggestionTargetsDataService.searchBy(this.searchFindByTargetMethod, options, ...linksToFollow);
  }

  /**
   * Return a Suggestion Target for a given id
   *
   * @param targetId
   *    The target id to retrieve.
   *
   * @return Observable<RemoteData<OpenaireSuggestionTarget>>
   *    The list of Suggestion Target.
   */
  public getTargetById(targetId: string): Observable<RemoteData<OpenaireSuggestionTarget>> {
    return this.suggestionTargetsDataService.findById(targetId);
  }

  /**
   * Return the list of Suggestion Target
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<OpenaireReciterSuggestionTarget>>>
   *    The list of Suggestion Target.
   */
  /*  public getReviewSuggestions(options: FindListOptions = {}, reciterId: string, ...linksToFollow: Array<FollowLinkConfig<OpenaireReciterSuggestionTarget>>): Observable<RemoteData<PaginatedList<OpenaireReciterSuggestionTarget>>> {
      return this.dataService.getBrowseEndpoint(options, `suggestions/${reciterId}`).pipe(
        take(1),
        flatMap((href: string) => this.dataService.findAllByHref(href, options, ...linksToFollow)),
      );*/
  // TEST
  /*    const pageInfo = new PageInfo({
        elementsPerPage: 10,
        totalElements: 6,
        totalPages: 1,
        currentPage: 0
      });
      const array = [
        PUBLICATION_ONE,
        PUBLICATION_TWO
      ];
      const paginatedList = new PaginatedList(pageInfo, array);
      const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
      return observableOf(paginatedListRD);*/

  // }

  /**
   * Used to delete Suggestion
   * @suggestionId
   */
  public deleteSuggestion(suggestionId: string): Observable<RestResponse> {
    return this.suggestionsDataService.delete(suggestionId);
    // TEST
    /*    const res = createSuccessfulRemoteDataObject({});
        return observableOf(res);*/
  }

  /**
   * Used to fetch Suggestion notification for user
   * @suggestionId
   */
  public getSuggestion(suggestionId: string, ...linksToFollow: Array<FollowLinkConfig<OpenaireSuggestion>>): Observable<RemoteData<OpenaireSuggestion>> {
    return this.suggestionsDataService.findById(suggestionId, ...linksToFollow);
    // TEST
    /*    const paginatedListRD = createSuccessfulRemoteDataObject(suggestionTargetObjectBollini);
        return observableOf(paginatedListRD);*/
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
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestion>>>
   *    The list of Suggestion.
   */
  public getSuggestionsByTargetAndSource(
    target: string,
    source: string,
    options: FindListOptions = {},
    ...linksToFollow: Array<FollowLinkConfig<OpenaireSuggestion>>
  ): Observable<RemoteData<PaginatedList<OpenaireSuggestion>>> {
    options.searchParams = [
      new RequestParam('target', target),
      new RequestParam('source', source)
    ];

    return this.suggestionsDataService.searchBy(this.searchFindByTargetAndSourceMethod, options, ...linksToFollow);
  }

  /**
   * Clear findByTargetAndSource suggestions requests from cache
   */
  public clearSuggestionRequests() {
    this.requestService.removeByHrefSubstring(this.searchFindByTargetAndSourceMethod);
  }
}
