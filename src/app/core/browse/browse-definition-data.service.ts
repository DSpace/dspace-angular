import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { BROWSE_DEFINITION } from '../shared/browse-definition.resource-type';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { FindListOptions } from '../data/find-list-options.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { FindAllData, FindAllDataImpl } from '../data/base/find-all-data';

@Injectable({
  providedIn: 'root',
})
@dataService(BROWSE_DEFINITION)
export class BrowseDefinitionDataService extends IdentifiableDataService<BrowseDefinition> implements FindAllData<BrowseDefinition> {
  private findAllData: FindAllDataImpl<BrowseDefinition>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('browses', requestService, rdbService, objectCache, halService);

    this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }


  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<BrowseDefinition>[]): Observable<RemoteData<PaginatedList<BrowseDefinition>>> {
    return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}

