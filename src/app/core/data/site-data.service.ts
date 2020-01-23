import { DataService } from './data.service';
import { Site } from '../shared/site.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { FindListOptions } from './request.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { Injectable } from '@angular/core';
import { getSucceededRemoteData } from '../shared/operators';

/**
 * Service responsible for handling requests related to the Site object
 */
@Injectable()
export class SiteDataService extends DataService<Site> {​
  protected linkPath = 'sites';
  protected forceBypassCache = false;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
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
   * Get the endpoint for browsing the site object
   * @param {FindListOptions} options
   * @param {Observable<string>} linkPath
   */
  getBrowseEndpoint(options: FindListOptions, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
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
