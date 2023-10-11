import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Section } from './models/section.model';
import { dataService } from '../data/base/data-service.decorator';
import { SECTION } from './models/section.resource-type';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { FindAllData } from '../data/base/find-all-data';
import { FindListOptions } from '../data/find-list-options.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { SearchDataImpl } from '../data/base/search-data';

/**
 * A service responsible for fetching data from the REST API on the sections endpoint.
 */
@Injectable()
@dataService(SECTION)
export class SectionDataService extends IdentifiableDataService<Section> {

  protected linkPath = 'sections';
  private findAllData: FindAllData<Section>;
  private searchData: SearchDataImpl<Section>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected dsoNameService: DSONameService
  ) {
    super('sections', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Find all the configured sections.
   */
  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Section>[]): Observable<RemoteData<PaginatedList<Section>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Find all the configured sections.
   */
  findVisibleSections(): Observable<RemoteData<PaginatedList<Section>>> {
    return this.searchData.searchBy('visibleTopBarSections');
  }

}
