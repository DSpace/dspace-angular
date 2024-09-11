import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  mergeMap,
  take,
} from 'rxjs/operators';

import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ConfigDataService } from './config-data.service';
import { ConfigObject } from './models/config.model';

@Injectable({ providedIn: 'root' })
export class SubmissionDefinitionsConfigDataService extends ConfigDataService {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissiondefinitions', requestService, rdbService, objectCache, halService);
  }

  findAll(options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ConfigObject>[]): Observable<RemoteData<PaginatedList<ConfigObject>>> {
    return this.getBrowseEndpoint(options).pipe(
      take(1),
      mergeMap((href: string) => super.findListByHref(href, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow)),
    );
  }
}
