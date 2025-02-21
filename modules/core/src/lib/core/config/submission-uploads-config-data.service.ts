import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../cache';
import { ObjectCacheService } from '../cache';
import { FollowLinkConfig } from '../data';
import { RemoteData } from '../data';
import { RequestService } from '../data';
import { HALEndpointService } from '../shared';
import { ConfigDataService } from './config-data.service';
import { ConfigObject } from './models';
import { SubmissionUploadsModel } from './models';

/**
 * Provides methods to retrieve, from REST server, bitstream access conditions configurations applicable during the submission process.
 */
@Injectable({ providedIn: 'root' })
export class SubmissionUploadsConfigDataService extends ConfigDataService {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissionuploads', requestService, rdbService, objectCache, halService);
  }

  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow): Observable<RemoteData<SubmissionUploadsModel>> {
    return super.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow as FollowLinkConfig<ConfigObject>[]) as Observable<RemoteData<SubmissionUploadsModel>>;
  }
}
