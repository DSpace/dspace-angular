import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { flatMap, take, tap, catchError } from 'rxjs/operators';

import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { dataService } from '../cache/builders/build-decorators';
import { RequestService } from '../data/request.service';
import { FindListOptions } from '../data/request.models';
import { DataService } from '../data/data.service';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { RemoteData } from '../data/remote-data';
import { SuggestionTargetObject } from './models/suggestion-target.model';
import { SUGGESTION_TARGET_OBJECT } from './models/suggestion-target-object.resource-type';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../data/paginated-list';

// TEST
import { ResourceType } from '../shared/resource-type';
import { PageInfo } from '../shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { of as observableOf } from 'rxjs';
import {
  suggestionTargetObjectBollini,
  suggestionTargetObjectDigilio
} from '../../shared/mocks/suggestion-target.mock';

import {
  PUBLICATION_ONE,
  PUBLICATION_TWO
} from '../../shared/mocks/reciter-suggestion-target.mock';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<SuggestionTargetObject> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'integration';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<SuggestionTargetObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<SuggestionTargetObject>) {
    super();
  }
}

/**
 * The service handling all Suggestion Target REST requests.
 */
@Injectable()
@dataService(SUGGESTION_TARGET_OBJECT)
export class SuggestionTargetRestService {
  /**
   * A private DataService implementation to delegate specific methods to.
   */
  private dataService: DataServiceImpl;

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {DefaultChangeAnalyzer<SuggestionTargetObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<SuggestionTargetObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Return the list of Suggestion Target
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<SuggestionTargetObject>>>
   *    The list of Suggestion Target.
   */
  public getTargets(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<SuggestionTargetObject>>): Observable<RemoteData<PaginatedList<SuggestionTargetObject>>> {
    // return this.dataService.getBrowseEndpoint(options, 'suggestiontargets').pipe(
    //   take(1),
    //   flatMap((href: string) => this.dataService.findAllByHref(href, options, ...linksToFollow)),
    // );
    // TEST
    const pageInfo = new PageInfo({
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
    return observableOf(paginatedListRD);
  }

  /**
   * Return the list of Suggestion Target
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<SuggestionTargetObject>>>
   *    The list of Suggestion Target.
   */
  public getReviewSuggestions(options: FindListOptions = {}, reciterId: string, ...linksToFollow: Array<FollowLinkConfig<SuggestionTargetObject>>): Observable<RemoteData<PaginatedList<SuggestionTargetObject>>> {
    // return this.dataService.getBrowseEndpoint(options, `suggestions/${reciterId}`).pipe(
    //   take(1),
    //   flatMap((href: string) => this.dataService.findAllByHref(href, options, ...linksToFollow)),
    // );
    // TEST
    const pageInfo = new PageInfo({
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
    return observableOf(paginatedListRD);
  }



  /**
   * Used to delete Suggestion
   * @suggestionId
   */
  public deleteReviewSuggestions(suggestionId: string): Observable<any> {
    // return this.dataService.getBrowseEndpoint(options, `suggestions/${suggestionId}`).pipe(
    //   take(1),
    //   flatMap((href: string) => this.dataService.findAllByHref(href, options, ...linksToFollow)),
    // );
    // TEST
    const res = createSuccessfulRemoteDataObject({});
    return observableOf(res);
  }

}
