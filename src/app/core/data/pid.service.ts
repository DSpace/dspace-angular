import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { hasValue } from '../../shared/empty.util';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RemoteData } from './remote-data';
import { FindByIDRequest } from './request.models';
import { RequestService } from './request.service';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<NormalizedDSpaceObject, DSpaceObject> {
  protected linkPath = 'pid';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService) {
    super();
  }

  getScopedEndpoint(scope: string): Observable<string> {
    return undefined;
  }

  getFindByIDHref(endpoint, resourceID): string {
    return endpoint.replace(/\{\?id\}/,`?id=${resourceID}`);
  }
}

@Injectable()
export class PIDService {
  protected linkPath = 'pid';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService) {
    this.dataService = new DataServiceImpl(null, requestService, rdbService, null, halService);
  }

  findById(id: string): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findById(id);
  }
}
