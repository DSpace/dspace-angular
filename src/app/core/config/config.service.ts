import { Observable } from 'rxjs';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ConfigObject } from './models/config.model';
import { RemoteData } from '../data/remote-data';
import { DataService } from '../data/data.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { map } from 'rxjs/operators';

class DataServiceImpl extends DataService<ConfigObject> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ConfigObject>,
    protected linkPath: string
  ) {
    super();
  }
}

// tslint:disable-next-line:max-classes-per-file
export abstract class ConfigService {
  /**
   * A private DataService instance to delegate specific methods to.
   */
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ConfigObject>,
    protected linkPath: string
  ) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator, this.linkPath);
  }

  public findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ConfigObject>[]): Observable<RemoteData<ConfigObject>> {
    return this.dataService.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<ConfigObject>) => {
        if (rd.hasFailed) {
          throw new Error(`Couldn't retrieve the config`);
        } else {
          return rd;
        }
      })
    );
  }
}
