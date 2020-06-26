import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { SUBMISSION_CC_LICENSE } from './models/submission-cc-licence.resource-type';
import { SubmissionCcLicence } from './models/submission-cc-license.model';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';

@Injectable()
@dataService(SUBMISSION_CC_LICENSE)
export class SubmissionCcLicenseDataService extends DataService<SubmissionCcLicence> {

  protected linkPath = 'submissioncclicenses';

  constructor(
    protected comparator: DefaultChangeAnalyzer<SubmissionCcLicence>,
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
