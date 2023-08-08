import { ResourceType } from '../../shared/resource-type';
import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ClarinUserRegistration } from '../../shared/clarin/clarin-user-registration.model';
import { BaseDataService } from '../base/base-data.service';
import { dataService } from '../base/data-service.decorator';
import { CoreState } from '../../core-state.model';
import { SearchData, SearchDataImpl } from '../base/search-data';
import { FindListOptions } from '../find-list-options.model';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../remote-data';
import { PaginatedList } from '../paginated-list.model';

export const linkName = 'clarinuserregistrations';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending user registration data from/to the Clarin User Registration REST API
 */
@Injectable()
@dataService(ClarinUserRegistration.type)
export class ClarinUserRegistrationDataService extends BaseDataService<ClarinUserRegistration> implements SearchData<ClarinUserRegistration> {
  protected linkPath = linkName;
  private searchData: SearchData<ClarinUserRegistration>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClarinUserRegistration>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<ClarinUserRegistration>[]): Observable<RemoteData<PaginatedList<ClarinUserRegistration>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
