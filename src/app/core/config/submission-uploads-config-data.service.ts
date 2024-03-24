import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ConfigDataService } from './config-data.service';
import { ConfigObject } from './models/config.model';
import { SubmissionUploadsModel } from './models/config-submission-uploads.model';

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
