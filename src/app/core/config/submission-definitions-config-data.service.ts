import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { ConfigDataService } from './config-data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ConfigObject } from './models/config.model';
import { dataService } from '../data/base/data-service.decorator';
import { SUBMISSION_DEFINITION_TYPE } from './models/config-type';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';

@Injectable()
@dataService(SUBMISSION_DEFINITION_TYPE)
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
