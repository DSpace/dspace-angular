import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { SubmissionCcLicenceUrl } from '../shared/submission-cc-license-url.model';
import { SUBMISSION_CC_LICENSE_URL } from '../shared/submission-cc-licence-link.resource-type';

@Injectable()
@dataService(SUBMISSION_CC_LICENSE_URL)
export class SubmissionCcLicenseUrlDataService extends DataService<SubmissionCcLicenceUrl> {

  protected linkPath = 'submissioncclicenses';

  constructor(
    protected comparator: DefaultChangeAnalyzer<SubmissionCcLicenceUrl>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected objectCache: ObjectCacheService,
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
  ) {
    super();
  }
}
