/* eslint-disable max-classes-per-file */
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { dataService } from '../../../data/base/data-service.decorator';
import { RequestService } from '../../../data/request.service';
import { RemoteData } from '../../../data/remote-data';
import { QualityAssuranceSourceObject } from '../models/quality-assurance-source.model';
import { QUALITY_ASSURANCE_SOURCE_OBJECT } from '../models/quality-assurance-source-object.resource-type';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../data/paginated-list.model';
import { FindListOptions } from '../../../data/find-list-options.model';
import { IdentifiableDataService } from '../../../data/base/identifiable-data.service';

/**
 * The service handling all Quality Assurance source REST requests.
 */
@Injectable()
@dataService(QUALITY_ASSURANCE_SOURCE_OBJECT)
export class QualityAssuranceSourceRestService extends IdentifiableDataService<QualityAssuranceSourceObject> {

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
    super('qualityassurancesources', requestService, rdbService, objectCache, halService);
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
    return this.getBrowseEndpoint(options).pipe(
      take(1),
      mergeMap((href: string) => this.findListByHref(href, options, true, true, ...linksToFollow)),
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
    return this.getBrowseEndpoint(options, 'qualityassurancesources').pipe(
      take(1),
      mergeMap((href: string) => this.findByHref(href + '/' + id, true, true, ...linksToFollow))
    );
  }
}
