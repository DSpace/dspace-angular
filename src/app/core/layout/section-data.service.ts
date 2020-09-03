/* tslint:disable:max-classes-per-file */

import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Section } from './models/section.model';
import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { SECTION } from './models/section.resource-type';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';

class DataServiceImpl extends DataService<Section> {
    protected linkPath = 'sections';

    constructor(
        protected requestService: RequestService,
        protected rdbService: RemoteDataBuildService,
        protected store: Store<CoreState>,
        protected objectCache: ObjectCacheService,
        protected halService: HALEndpointService,
        protected notificationsService: NotificationsService,
        protected http: HttpClient,
        protected comparator: ChangeAnalyzer<Section>) {
        super();
    }
}

/**
 * A service responsible for fetching data from the REST API on the sections endpoint.
 */
@Injectable()
@dataService(SECTION)
export class SectionDataService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<Section>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
    }

  /**
   * Provide detailed information about a specific section.
   * @param id id of the section
   */
  findById(id: string): Observable<RemoteData<Section>> {
    return this.dataService.findById(id);
  }

  /**
   * Find all the configured sections.
   */
  findAll(): Observable<RemoteData<PaginatedList<Section>>> {
      return this.dataService.findAll();
  }

}
