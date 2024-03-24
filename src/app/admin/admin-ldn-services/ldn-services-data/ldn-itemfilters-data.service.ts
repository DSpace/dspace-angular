import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import {
  FindAllData,
  FindAllDataImpl,
} from '../../../core/data/base/find-all-data';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Itemfilter } from '../ldn-services-model/ldn-service-itemfilters';

/**
 * A service responsible for fetching/sending data from/to the REST API on the itemfilters endpoint
 */
@Injectable({ providedIn: 'root' })
export class LdnItemfiltersService extends IdentifiableDataService<Itemfilter> implements FindAllData<Itemfilter> {
  private findAllData: FindAllDataImpl<Itemfilter>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
  ) {
    super('itemfilters', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Gets the endpoint URL for the itemfilters.
   *
   * @returns {string} - The endpoint URL.
   */
  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Finds all itemfilters based on the provided options and link configurations.
   *
   * @param {FindListOptions} options - The options for finding a list of itemfilters.
   * @param {boolean} useCachedVersionIfAvailable - Whether to use the cached version if available.
   * @param {boolean} reRequestOnStale - Whether to re-request the data if it's stale.
   * @param {...FollowLinkConfig<Itemfilter>[]} linksToFollow - Configurations for following specific links.
   * @returns {Observable<RemoteData<PaginatedList<Itemfilter>>>} - An observable of remote data containing a paginated list of itemfilters.
   */
  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Itemfilter>[]): Observable<RemoteData<PaginatedList<Itemfilter>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
