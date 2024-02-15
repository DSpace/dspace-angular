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
import { ClarinUserMetadata } from '../../shared/clarin/clarin-user-metadata.model';
import { dataService } from '../base/data-service.decorator';
import { CoreState } from '../../core-state.model';
import { BaseDataService } from '../base/base-data.service';
import { FindListOptions } from '../find-list-options.model';
import { FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../remote-data';
import { PaginatedList } from '../paginated-list.model';
import { SearchData, SearchDataImpl } from '../base/search-data';

export const linkName = 'clarinusermetadatas';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending user metadata from/to the Clarin User Metadata
 */
@Injectable()
@dataService(ClarinUserMetadata.type)
export class ClarinUserMetadataDataService extends BaseDataService<ClarinUserMetadata> {
  protected linkPath = linkName;
  private searchData: SearchData<ClarinUserMetadata>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClarinUserMetadata>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<ClarinUserMetadata>[]): Observable<RemoteData<PaginatedList<ClarinUserMetadata>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
