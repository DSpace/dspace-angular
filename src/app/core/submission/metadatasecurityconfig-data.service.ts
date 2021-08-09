import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { DataService } from '../data/data.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { MetadataSecurityConfiguration } from './models/metadata-security-configuration';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<MetadataSecurityConfiguration> {
  protected linkPath = 'securitysettings';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<MetadataSecurityConfiguration>) {
    super();
  }
}

/**
 * A service that provides methods to make REST requests with securitysettings endpoint.
 */
@Injectable({
  providedIn: 'root'
})
@dataService(MetadataSecurityConfiguration.type)
export class MetadataSecurityConfigurationService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<MetadataSecurityConfiguration>) {
    this.dataService = new DataServiceImpl(requestService, rdbService,
      null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * It provides the configuration for metadata security
   * @param entityType
   */
  findById(entityType: string): Observable<RemoteData<MetadataSecurityConfiguration>> {
    return this.dataService.findById(entityType);
  }
}

