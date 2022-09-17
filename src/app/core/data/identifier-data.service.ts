import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from './base/data-service.decorator';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { BaseDataService } from './base/base-data.service';
import { RequestService } from './request.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { CoreState } from '../core-state.model';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { Item } from '../shared/item.model';
import { IDENTIFIERS } from '../../shared/object-list/identifier-data/identifier-data.resource-type';
import { IdentifierData } from '../../shared/object-list/identifier-data/identifier-data.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { map } from 'rxjs/operators';
import {ConfigurationProperty} from '../shared/configuration-property.model';
import {ConfigurationDataService} from './configuration-data.service';

@Injectable()
@dataService(IDENTIFIERS)
export class IdentifierDataService extends BaseDataService<IdentifierData> {

  constructor(
    protected comparator: DefaultChangeAnalyzer<IdentifierData>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected objectCache: ObjectCacheService,
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    private configurationService: ConfigurationDataService,
  ) {
    super('identifiers', requestService, rdbService, objectCache, halService);
  }

  /**
   * Returns {@link RemoteData} of {@link IdentifierData} representing identifiers for this item
   * @param item  Item we are querying
   */
  getIdentifierDataFor(item: Item): Observable<RemoteData<IdentifierData>> {
    return this.findByHref(item._links.identifiers.href, false, true);
  }

  /**
   * Should we allow registration of new DOIs via the item status page?
   */
  public getIdentifierRegistrationConfiguration(): Observable<string[]> {
    return this.configurationService.findByPropertyName('identifiers.item-status.register').pipe(
      getFirstCompletedRemoteData(),
      map((propertyRD: RemoteData<ConfigurationProperty>) => propertyRD.hasSucceeded ? propertyRD.payload.values : [])
    );
  }
}
