/* eslint-disable max-classes-per-file */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { CONFIG_PROPERTY } from '../shared/config-property.resource-type';
import { CoreState } from '../core-state.model';

class DataServiceImpl extends DataService<ConfigurationProperty> {
  protected linkPath = 'properties';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ConfigurationProperty>) {
    super();
  }
}

@Injectable()
@dataService(CONFIG_PROPERTY)
/**
 * Data Service responsible for retrieving Configuration properties
 */
export class ConfigurationDataService {
  protected linkPath = 'properties';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ConfigurationProperty>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Finds a configuration property by name
   * @param name
   */
  findByPropertyName(name: string): Observable<RemoteData<ConfigurationProperty>> {
    return this.dataService.findById(name);
  }
}
