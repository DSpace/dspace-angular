/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../cache/builders/build-decorators';
import { RequestService } from '../../../data/request.service';
import { DataService } from '../../../data/data.service';
import { ChangeAnalyzer } from '../../../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../../../data/default-change-analyzer.service';
import { RemoteData } from '../../../data/remote-data';
import { QualityAssuranceSourceObject } from '../models/quality-assurance-source.model';
import { QUALITY_ASSURANCE_SOURCE_OBJECT } from '../models/quality-assurance-source-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import {CoreState} from '../../../core-state.model';
import {FindListOptions} from '../../../data/find-list-options.model';

/**
 * A private DataService implementation to delegate specific methods to.
 */
class DataServiceImpl extends DataService<QualityAssuranceSourceObject> {
  /**
   * The REST endpoint.
   */
  protected linkPath = 'qualityassurancesources';

  /**
   * Initialize service variables
   * @param {RequestService} requestService
   * @param {RemoteDataBuildService} rdbService
   * @param {Store<CoreState>} store
   * @param {ObjectCacheService} objectCache
   * @param {HALEndpointService} halService
   * @param {NotificationsService} notificationsService
   * @param {HttpClient} http
   * @param {ChangeAnalyzer<QualityAssuranceSourceObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<QualityAssuranceSourceObject>) {
    super();
  }
}

/**
 * The service handling all Quality Assurance source REST requests.
 */
@Injectable()
@dataService(QUALITY_ASSURANCE_SOURCE_OBJECT)
export class QualityAssuranceSourceRestService {
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
   * @param {DefaultChangeAnalyzer<QualityAssuranceSourceObject>} comparator
   */
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<QualityAssuranceSourceObject>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Return the list of Quality Assurance source.
   *
   * @param options
   *    Find list options object.
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<PaginatedList<QualityAssuranceSourceObject>>>
   *    The list of Quality Assurance source.
   */
  public getSources(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<QualityAssuranceSourceObject>[]): Observable<RemoteData<PaginatedList<QualityAssuranceSourceObject>>> {
    return this.dataService.getBrowseEndpoint(options, 'qualityassurancesources').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findAllByHref(href, options, true, true, ...linksToFollow)),
    );
  }

  /**
   * Clear FindAll source requests from cache
   */
  public clearFindAllSourceRequests() {
    this.requestService.setStaleByHrefSubstring('qualityassurancesources');
  }

  /**
   * Return a single Quality Assurance source.
   *
   * @param id
   *    The Quality Assurance source id
   * @param linksToFollow
   *    List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   * @return Observable<RemoteData<QualityAssuranceSourceObject>>
   *    The Quality Assurance source.
   */
  public getSource(id: string, ...linksToFollow: FollowLinkConfig<QualityAssuranceSourceObject>[]): Observable<RemoteData<QualityAssuranceSourceObject>> {
    const options = {};
    return this.dataService.getBrowseEndpoint(options, 'qualityassurancesources').pipe(
      take(1),
      mergeMap((href: string) => this.dataService.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}
