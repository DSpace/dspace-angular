import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { SearchComponent } from './models/search-component.model';
import { dataService } from '../cache/builders/build-decorators';
import { SEARCH_COMPONENT } from './models/search-component.resource-type';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<SearchComponent> {
  protected linkPath = 'boxrelationconfigurations';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<SearchComponent>) {
    super();
  }
}

@Injectable()
@dataService(SEARCH_COMPONENT)
export class SearchcomponentService {
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<SearchComponent>) {
      this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
    }

  /**
   * It provides the configuration for a box
   * @param boxId id of box
   */
  findById(boxId: number): Observable<RemoteData<SearchComponent>> {
    return this.dataService.findById(boxId.toString());
  }

  findByHref(href: string, ...linksToFollow: Array<FollowLinkConfig<SearchComponent>>): Observable<RemoteData<SearchComponent>> {
    return this.dataService.findByHref(href, ...linksToFollow);
  }
}
