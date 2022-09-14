import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { Handle } from '../handle/handle.model';
import { HANDLE } from '../handle/handle.resource-type';
import { FindListOptions } from './request.models';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list.model';

/**
 * A service responsible for fetching/sending data from/to the REST API on the metadatafields endpoint
 */
@Injectable()
@dataService(HANDLE)
export class HandleDataService extends DataService<Handle> {
  protected linkPath = 'handles';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<Handle>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService) {
    super();
  }

  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable: boolean = true, reRequestOnStale: boolean = true, ...linksToFollow): Observable<RemoteData<PaginatedList<Handle>>> {
    return super.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
