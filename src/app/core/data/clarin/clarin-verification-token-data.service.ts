import { Injectable } from '@angular/core';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { DefaultChangeAnalyzer } from '../default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ClarinVerificationToken } from '../../shared/clarin/clarin-verification-token.model';
import { CoreState } from '../../core-state.model';
import { dataService } from '../base/data-service.decorator';
import {DeleteData, DeleteDataImpl} from '../base/delete-data';
import {SearchData, SearchDataImpl} from '../base/search-data';
import {Observable} from 'rxjs';
import {RemoteData} from '../remote-data';
import {NoContent} from '../../shared/NoContent.model';
import {FindListOptions} from '../find-list-options.model';
import {FollowLinkConfig} from '../../../shared/utils/follow-link-config.model';
import {PaginatedList} from '../paginated-list.model';
import {IdentifiableDataService} from '../base/identifiable-data.service';

export const linkName = 'clarinverificationtokens';
/**
 * A service responsible for fetching/sending license data from/to the ClarinVerificationToken REST API
 */
@Injectable()
@dataService(ClarinVerificationToken.type)
export class ClarinVerificationTokenDataService extends IdentifiableDataService<ClarinVerificationToken> implements SearchData<ClarinVerificationToken>, DeleteData<ClarinVerificationToken> {
  protected linkPath = linkName;
  private deleteData: DeleteData<ClarinVerificationToken>;
  private searchData: SearchData<ClarinVerificationToken>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<ClarinVerificationToken>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
    this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
  }

  delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.delete(objectId, copyVirtualMetadata);
  }

  deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
    return this.deleteData.deleteByHref(href, copyVirtualMetadata);
  }

  searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<ClarinVerificationToken>[]): Observable<RemoteData<PaginatedList<ClarinVerificationToken>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

}
