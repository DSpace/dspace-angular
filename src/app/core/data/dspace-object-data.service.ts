import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DSpaceObject } from '../shared/dspace-object.model';
import { DSPACE_OBJECT } from '../shared/dspace-object.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<DSpaceObject> {
  protected linkPath = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DSpaceObject>) {
    super();
  }

  getIDHref(endpoint, resourceID): string {
    return endpoint.replace(/\{\?uuid\}/, `?uuid=${resourceID}`);
  }
}

@Injectable()
@dataService(DSPACE_OBJECT)
export class DSpaceObjectDataService {
  protected linkPath = 'dso';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DSpaceObject>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  findById(uuid: string): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findById(uuid);
  }
}
