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
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { SubmissionCcLicenceUrl } from './models/submission-cc-license-url.model';
import { SUBMISSION_CC_LICENSE_URL } from './models/submission-cc-licence-link.resource-type';
import { Field, Option, SubmissionCcLicence } from './models/submission-cc-license.model';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { getRemoteDataPayload, getFirstSucceededRemoteData } from '../shared/operators';
import { isNotEmpty } from '../../shared/empty.util';

@Injectable()
@dataService(SUBMISSION_CC_LICENSE_URL)
export class SubmissionCcLicenseUrlDataService extends DataService<SubmissionCcLicenceUrl> {

  protected linkPath = 'submissioncclicenseUrls-search';

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

  /**
   * Get the link to the Creative Commons license corresponding to the given type and options.
   * @param ccLicense   the Creative Commons license type
   * @param options     the selected options of the license fields
   */
  getCcLicenseLink(ccLicense: SubmissionCcLicence, options: Map<Field, Option>): Observable<string> {

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
              };
            }),
        ]
      }
    ).pipe(
      switchMap((href) => this.findByHref(href)),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((response) => response.url),
    );
  }

  protected getSearchEndpoint(searchMethod: string): Observable<string> {
    return this.halService.getEndpoint(`${this.linkPath}`).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/${searchMethod}`));
  }
}
