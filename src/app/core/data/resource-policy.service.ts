import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { FindAllOptions } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ResourcePolicy } from '../shared/resource-policy.model';
import { RemoteData } from '../data/remote-data';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ChangeAnalyzer } from './change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<ResourcePolicy> {
  protected linkPath = 'resourcepolicies';
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
    protected comparator: ChangeAnalyzer<ResourcePolicy>) {
    super();
  }

  getBrowseEndpoint(options: FindAllOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }
}

/**
 * A service responsible for fetching/sending data from/to the REST API on the resourcepolicies endpoint
 */
@Injectable()
export class ResourcePolicyService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ResourcePolicy>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, dataBuildService, null, objectCache, halService, notificationsService, http, comparator);
  }

  findByHref(href: string, options?: HttpOptions): Observable<RemoteData<ResourcePolicy>> {
    return this.dataService.findByHref(href, options);
  }
}
