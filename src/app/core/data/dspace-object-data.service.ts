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

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<NormalizedDSpaceObject, DSpaceObject> {
  protected linkPath = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService) {
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
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, halService, objectCache);
  }

  findById(uuid: string): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findById(uuid);
  }
}
