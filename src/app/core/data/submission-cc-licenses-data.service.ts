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
import { SUBMISSION_CC_LICENSE } from '../shared/submission-cc-licences.resource-type';
import { Field, Option, SubmissionCcLicence } from '../shared/submission-cc-license.model';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { GetRequest } from './request.models';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StringResponse } from '../cache/response.models';
import { StringResponseParsingService } from './string-response-parsing.service';

@Injectable()
@dataService(SUBMISSION_CC_LICENSE)
export class SubmissionCcLicensesDataService extends DataService<SubmissionCcLicence> {

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

  /**
   * Get the link to the Creative Commons license corresponding to the given type and options.
   * @param ccLicense   the Creative Commons license type
   * @param options     the selected options of the license fields
   */
  getCcLicenseLink(ccLicense: SubmissionCcLicence, options: Map<Field, Option>): Observable<StringResponse> {

    const requestId = this.requestService.generateRequestId();

    return this.getSearchByHref(
      'rightsByQuestions',{
        searchParams: [
          {
            fieldName: 'license',
            fieldValue: ccLicense.id
          },
          ...ccLicense.fields.map(
            (field) => {
              return {
                fieldName: `answer_${field.id}`,
                fieldValue: options.get(field).id,
              }
            }),
        ]
      }
    ).pipe(
      map((endpoint) => new GetRequest(
        requestId,
        endpoint,
        undefined, {
          responseType: 'text',
        },
      )),
      tap((request) => request.getResponseParser = () => StringResponseParsingService),
      configureRequest(this.requestService),
      switchMap(() => this.requestService.getByUUID(requestId)),
      getResponseFromEntry(),
      map((response) => response as StringResponse),
    );
  }
}
