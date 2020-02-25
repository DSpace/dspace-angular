import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { DataService } from '../data/data.service';

import { RequestService } from '../data/request.service';
import { FindListOptions } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Group } from './models/group.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { SearchParam } from '../cache/models/search-param.model';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';

/**
 * Provides methods to retrieve eperson group resources.
 */
@Injectable({
  providedIn: 'root'
})
export class GroupDataService extends DataService<Group> {
  protected linkPath = 'groups';
  protected browseEndpoint = '';

  constructor(
    protected comparator: DSOChangeAnalyzer<Group>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super();
  }

  /**
   * Check if the current user is member of to the indicated group
   *
   * @param groupName
   *    the group name
   * @return boolean
   *    true if user is member of the indicated group, false otherwise
   */
  isMemberOf(groupName: string): Observable<boolean> {
    const searchHref = 'isMemberOf';
    const options = new FindListOptions();
    options.searchParams = [new SearchParam('groupName', groupName)];

    return this.searchBy(searchHref, options).pipe(
        filter((groups: RemoteData<PaginatedList<Group>>) => !groups.isResponsePending),
        take(1),
        map((groups: RemoteData<PaginatedList<Group>>) => groups.payload.totalElements > 0)
      );
  }

}
