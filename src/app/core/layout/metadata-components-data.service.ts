import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { MetadataComponent } from '../layout/models/metadata-component.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { dataService } from '../cache/builders/build-decorators';
import { METADATACOMPONENT } from '../layout/models/metadata-component.resource-type';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<MetadataComponent> {
  protected linkPath = 'metadatacomponents';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<MetadataComponent>) {
    super();
  }
}
/**
 * A service responsible for fetching data from the REST API on the metadatacomponents endpoint
 */
@Injectable()
@dataService(METADATACOMPONENT)
export class MetadataComponentsDataService {

  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<MetadataComponent>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
    }

  /**
   * It provides the configuration for a box that visualize a list of
   * metadata according to specific rules
   * @param boxShortname shortname of box
   */
  findById(boxShortname: string): Observable<RemoteData<MetadataComponent>> {
    return this.dataService.findById(boxShortname);
  }
}
