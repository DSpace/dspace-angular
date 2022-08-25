import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { SUBMISSION_ACCESSES_TYPE } from './models/config-type';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ConfigObject } from './models/config.model';
import { SubmissionAccessesModel } from './models/config-submission-accesses.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { CoreState } from '../core-state.model';
import { dataService } from '../data/base/data-service.decorator';

/**
 * Provides methods to retrieve, from REST server, bitstream access conditions configurations applicable during the submission process.
 */
@Injectable()
@dataService(SUBMISSION_ACCESSES_TYPE)
export class SubmissionAccessesConfigService extends ConfigService {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissionaccessoptions', requestService, rdbService, objectCache, halService);
  }

  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow): Observable<RemoteData<SubmissionAccessesModel>> {
    return super.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow as FollowLinkConfig<ConfigObject>[]) as Observable<RemoteData<SubmissionAccessesModel>>;
  }
}
