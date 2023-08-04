import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { Handle } from '../handle/handle.model';
import { HANDLE } from '../handle/handle.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { CoreState } from '../core-state.model';
import { BaseDataService } from './base/base-data.service';
import { dataService } from './base/data-service.decorator';
import {CreateData, CreateDataImpl} from './base/create-data';
import {RequestParam} from '../cache/models/request-param.model';
import {FindAllData, FindAllDataImpl} from './base/find-all-data';
import {FindListOptions} from './find-list-options.model';
import {FollowLinkConfig} from '../../shared/utils/follow-link-config.model';
import {PaginatedList} from './paginated-list.model';

export const linkName = 'handles';
/**
 * A service responsible for fetching/sending data from/to the REST API on the metadatafields endpoint
 */
@Injectable()
@dataService(HANDLE)
export class HandleDataService extends BaseDataService<Handle> implements CreateData<Handle>, FindAllData<Handle> {
  protected linkPath = linkName;
  private createData: CreateData<Handle>;
  private findAllData: FindAllData<Handle>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<Handle>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService) {
    super(linkName, requestService, rdbService, objectCache, halService, undefined);

    this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  create(object: Handle, ...params: RequestParam[]): Observable<RemoteData<Handle>> {
    return this.createData.create(object, ...params);
  }

  findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Handle>[]): Observable<RemoteData<PaginatedList<Handle>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
