import { Injectable } from '@angular/core';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Observable } from 'rxjs';

import { DSONameService } from '../breadcrumbs/dso-name.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Section } from '../layout/models/section.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { SearchDataImpl } from './base/search-data';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

/**
 * A service responsible for fetching data from the REST API on the sections endpoint.
 */
@Injectable({ providedIn: 'root' })
export class SectionDataService extends IdentifiableDataService<Section> {

  protected linkPath = 'sections';
  private searchData: SearchDataImpl<Section>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected dsoNameService: DSONameService,
  ) {
    super('sections', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }


  /**
   * Finds all sections configured to be visible in the top navigation bar.
   * Uses the 'visibleTopBarSections' search endpoint on the backend.
   */
  findVisibleSections(): Observable<RemoteData<PaginatedList<Section>>> {
    return this.searchData.searchBy('visibleTopBarSections');
  }

}
