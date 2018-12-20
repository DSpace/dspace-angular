import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';
import { CoreState } from '../core.reducers';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { FindAllOptions } from './request.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DataBuildService } from '../cache/builders/data-build.service';
import { DSOUpdateComparator } from './dso-update-comparator';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<NormalizedDSpaceObject, DSpaceObject> {
  protected linkPath = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: DataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected authService: AuthService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOUpdateComparator) {
    super();
  }

  getBrowseEndpoint(options: FindAllOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  getFindByIDHref(endpoint, resourceID): string {
    return endpoint.replace(/\{\?uuid\}/,`?uuid=${resourceID}`);
  }
}

@Injectable()
export class DSpaceObjectDataService {
  protected linkPath = 'dso';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: DataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected authService: AuthService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOUpdateComparator) {
    this.dataService = new DataServiceImpl(requestService, rdbService, dataBuildService, null, objectCache, halService, authService, notificationsService, http, comparator);
  }

  findById(uuid: string): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findById(uuid);
  }
}
