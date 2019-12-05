import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Bundle } from '../shared/bundle.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FindListOptions } from './request.models';
import { Observable } from 'rxjs/internal/Observable';

/**
 * A service responsible for fetching/sending data from/to the REST API on the bundles endpoint
 */
@Injectable()
export class BundleDataService extends DataService<Bundle> {
  protected linkPath = 'bundles';
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
    protected comparator: DefaultChangeAnalyzer<Bundle>) {
    super();
  }

  /**
   * Get the endpoint for browsing bundles
   * @param {FindListOptions} options
   * @returns {Observable<string>}
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
