import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { EditItemMode } from './models/edititem-mode.model';
import { DataService } from '../data/data.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { PaginatedList } from '../data/paginated-list';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<EditItemMode> {
  protected linkPath = 'edititemmodes';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<EditItemMode>) {
    super();
  }
}

/**
 * A service that provides methods to make REST requests with edititems endpoint.
 */
@Injectable()
@dataService(EditItemMode.type)
export class EditItemModeDataService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<EditItemMode>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
    }

  /**
   * It provides the configuration for a box
   * @param boxId id of box
   */
  findById(boxId: number): Observable<RemoteData<EditItemMode>> {
    return this.dataService.findById(boxId.toString());
  }

  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<EditItemMode>>): Observable<RemoteData<PaginatedList<EditItemMode>>> {
    return this.dataService.findAllByHref(href);
  }
}
