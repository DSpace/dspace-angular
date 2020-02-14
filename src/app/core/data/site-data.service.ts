import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getSucceededRemoteData } from '../shared/operators';
import { Site } from '../shared/site.model';
import { SITE } from '../shared/site.resource-type';
import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

/**
 * Service responsible for handling requests related to the Site object
 */
@Injectable()
@dataService(SITE)
export class SiteDataService extends DataService<Site> {​
  protected linkPath = 'sites';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Site>,
  ) {
    super();
  }

  /**
   * Retrieve the Site Object
   */
  find(): Observable<Site> {
    return this.findAll().pipe(
      getSucceededRemoteData(),
      map((remoteData: RemoteData<PaginatedList<Site>>) => remoteData.payload),
      map((list: PaginatedList<Site>) => list.page[0])
    );
  }
}
