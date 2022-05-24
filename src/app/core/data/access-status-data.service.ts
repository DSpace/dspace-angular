import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { CoreState } from '../core-state.model';
import { AccessStatusObject } from 'src/app/shared/object-list/access-status-badge/access-status.model';
import { ACCESS_STATUS } from 'src/app/shared/object-list/access-status-badge/access-status.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { Item } from '../shared/item.model';

@Injectable()
@dataService(ACCESS_STATUS)
export class AccessStatusDataService extends DataService<AccessStatusObject> {

  protected linkPath = 'accessStatus';

  constructor(
    protected comparator: DefaultChangeAnalyzer<AccessStatusObject>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected objectCache: ObjectCacheService,
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
  ) {
    super();
  }

  /**
   * Returns {@link RemoteData} of {@link AccessStatusObject} that is the access status of the given item
   * @param item  Item we want the access status of
   */
  findAccessStatusFor(item: Item): Observable<RemoteData<AccessStatusObject>> {
    return this.findByHref(item._links.accessStatus.href);
  }
}
