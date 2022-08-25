import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ConfigObject } from './models/config.model';
import { SUBMISSION_FORMS_TYPE } from './models/config-type';
import { SubmissionFormsModel } from './models/config-submission-forms.model';
import { RemoteData } from '../data/remote-data';
import { Observable } from 'rxjs';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../data/base/data-service.decorator';

@Injectable()
@dataService(SUBMISSION_FORMS_TYPE)
export class SubmissionFormsConfigService extends ConfigService {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissionforms', requestService, rdbService, objectCache, halService);
  }

  public findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<SubmissionFormsModel>[]): Observable<RemoteData<SubmissionFormsModel>> {
    return super.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow as FollowLinkConfig<ConfigObject>[]) as Observable<RemoteData<SubmissionFormsModel>>;
  }
}
