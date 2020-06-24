import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, first, flatMap, map } from 'rxjs/operators';

import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { dataService } from '../../cache/builders/build-decorators';
import { DataService } from '../../data/data.service';
import { RequestService } from '../../data/request.service';
import { FindListOptions, RestRequest, VocabularyEntriesRequest } from '../../data/request.models';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { RemoteData } from '../../data/remote-data';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { CoreState } from '../../core.reducers';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ChangeAnalyzer } from '../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../data/default-change-analyzer.service';
import { PaginatedList } from '../../data/paginated-list';
import { Vocabulary } from './models/vocabulary.model';
import { VOCABULARY } from './models/vocabularies.resource-type';
import { VocabularyEntry } from './models/vocabulary-entry.model';
import { hasValue, isNotEmptyOperator } from '../../../shared/empty.util';
import { configureRequest, filterSuccessfulResponses, getRequestFromRequestHref } from '../../shared/operators';
import { GenericSuccessResponse } from '../../cache/response.models';
import { VocabularyFindOptions } from './models/vocabulary-find-options.model';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<Vocabulary> {
  protected linkPath = 'vocabularies';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<Vocabulary>) {
    super();
  }

}

/**
 * A service responsible for fetching/sending data from/to the REST API on the vocabularies endpoint
 */
@Injectable({
  providedIn: 'root'
})
@dataService(VOCABULARY)
export class VocabularyService {
  protected searchByMetadataAndCollectionMethod = 'byMetadataAndCollection';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Vocabulary>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Returns an observable of {@link RemoteData} of a {@link Vocabulary}, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the {@link Vocabulary}
   * @param href            The url of {@link Vocabulary} we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<Vocabulary>>}
   *    Return an observable that emits vocabulary object
   */
  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<Vocabulary>>): Observable<RemoteData<any>> {
    return this.dataService.findByHref(href, ...linksToFollow);
  }

  /**
   * Returns an observable of {@link RemoteData} of a {@link Vocabulary}, based on its ID, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param id              ID of {@link Vocabulary} we want to retrieve
   * @param linksToFollow   List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<Vocabulary>>}
   *    Return an observable that emits vocabulary object
   */
  findById(id: string, ...linksToFollow: Array<FollowLinkConfig<Vocabulary>>): Observable<RemoteData<Vocabulary>> {
    return this.dataService.findById(id, ...linksToFollow);
  }

  /**
   * Returns {@link RemoteData} of all object with a list of {@link FollowLinkConfig}, to indicate which embedded
   * info should be added to the objects
   *
   * @param options        Find list options object
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<Vocabulary>>>}
   *    Return an observable that emits object list
   */
  findAll(options: FindListOptions = {}, ...linksToFollow: Array<FollowLinkConfig<Vocabulary>>): Observable<RemoteData<PaginatedList<Vocabulary>>> {
    return this.dataService.findAll(options, ...linksToFollow);
  }

  /**
   * Return the {@link VocabularyEntry} list for a given {@link Vocabulary}
   *
   * @param options         The {@link VocabularyFindOptions} for the request
   * @return {Observable<RemoteData<PaginatedList<VocabularyEntry>>>}
   *    Return an observable that emits object list
   */
  getVocabularyEntries(options: VocabularyFindOptions): Observable<RemoteData<PaginatedList<VocabularyEntry>>> {

    return this.dataService.getFindAllHref(options, `${options.name}/entries`).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      getVocabularyEntriesFor(this.requestService, this.rdbService)
    );
  }

  /**
   * Return the controlled {@link Vocabulary} configured for the specified metadata and collection if any.
   *
   * @param options         The {@link VocabularyFindOptions} for the request
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<Vocabulary>>>}
   *    Return an observable that emits object list
   */
  searchByMetadataAndCollection(options: VocabularyFindOptions, ...linksToFollow: Array<FollowLinkConfig<Vocabulary>>): Observable<RemoteData<Vocabulary>> {

    return this.dataService.getSearchByHref(this.searchByMetadataAndCollectionMethod, options).pipe(
      first((href: string) => hasValue(href)),
      flatMap((href: string) => this.dataService.findByHref(href))
    )
  }

}

/**
 * Operator for turning a href into a PaginatedList of VocabularyEntry
 * @param requestService
 * @param rdb
 */
export const getVocabularyEntriesFor = (requestService: RequestService, rdb: RemoteDataBuildService) =>
  (source: Observable<string>): Observable<RemoteData<PaginatedList<VocabularyEntry>>> =>
    source.pipe(
      map((href: string) => new VocabularyEntriesRequest(requestService.generateRequestId(), href)),
      configureRequest(requestService),
      toRDPaginatedVocabularyEntries(requestService, rdb)
    );

/**
 * Operator for turning a RestRequest into a PaginatedList of VocabularyEntry
 * @param requestService
 * @param rdb
 */
export const toRDPaginatedVocabularyEntries = (requestService: RequestService, rdb: RemoteDataBuildService) =>
  (source: Observable<RestRequest>): Observable<RemoteData<PaginatedList<VocabularyEntry>>> => {
    const href$ = source.pipe(map((request: RestRequest) => request.href));

    const requestEntry$ = href$.pipe(getRequestFromRequestHref(requestService));

    const payload$ = requestEntry$.pipe(
      filterSuccessfulResponses(),
      map((response: GenericSuccessResponse<VocabularyEntry[]>) => new PaginatedList(response.pageInfo, response.payload)),
      map((list: PaginatedList<VocabularyEntry>) => Object.assign(list, {
        page: list.page ? list.page.map((entry: VocabularyEntry) => Object.assign(new VocabularyEntry(), entry)) : list.page
      })),
      distinctUntilChanged()
    );

    return rdb.toRemoteDataObservable(requestEntry$, payload$);
  };
