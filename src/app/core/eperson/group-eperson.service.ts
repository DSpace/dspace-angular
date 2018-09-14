import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { filter, map, take } from 'rxjs/operators';

import { EpersonService } from './eperson.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { FindAllOptions } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedGroupModel } from './models/NormalizedGroup.model';
import { Group } from './models/group.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { SearchParam } from '../cache/models/search-param.model';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';

@Injectable()
export class GroupEpersonService extends EpersonService<NormalizedGroupModel, Group> {
  protected linkPath = 'groups';
  protected browseEndpoint = '';
  protected forceBypassCache = false;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super();
  }

  isMemberOf(groupName: string): Observable<boolean> {
    const searchHref = 'isMemberOf';
    const options = new FindAllOptions();
    options.searchParams = [new SearchParam('groupName', groupName)];

    return this.searchBy(searchHref, options).pipe(
        filter((groups: RemoteData<PaginatedList<Group>>) => !groups.isResponsePending),
        take(1),
        map((groups: RemoteData<PaginatedList<Group>>) => groups.payload.totalElements > 0)
      );
  }
}
