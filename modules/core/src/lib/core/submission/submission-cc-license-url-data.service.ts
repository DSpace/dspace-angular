import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { RemoteDataBuildService , RequestParam , ObjectCacheService } from '../cache';
import { BaseDataService ,
  SearchData,
  SearchDataImpl,
, FindListOptions , FollowLinkConfig , PaginatedList , RemoteData , RequestService } from '../data';
import { HALEndpointService ,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../shared';
import {
  Field,
  Option,
  SubmissionCcLicence,
 SubmissionCcLicenceUrl } from './models';

@Injectable({ providedIn: 'root' })
export class SubmissionCcLicenseUrlDataService extends BaseDataService<SubmissionCcLicenceUrl> implements SearchData<SubmissionCcLicenceUrl> {
  private searchData: SearchDataImpl<SubmissionCcLicenceUrl>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('submissioncclicenseUrls-search', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive, (href, searchMethod) => `${href}/${searchMethod}`);
  }

  /**
   * Get the link to the Creative Commons license corresponding to the given type and options.
   * @param ccLicense   the Creative Commons license type
   * @param options     the selected options of the license fields
   */
  getCcLicenseLink(ccLicense: SubmissionCcLicence, options: Map<Field, Option>): Observable<string> {

    return this.searchData.getSearchByHref(
      'rightsByQuestions',{
        searchParams: [
          new RequestParam('license', ccLicense.id),
          ...ccLicense.fields.map((field: Field) => new RequestParam(`answer_${field.id}`, options.get(field).id)),
        ],
      },
    ).pipe(
      switchMap((href) => this.findByHref(href)),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((response) => response.url),
    );
  }

  /**
   * Make a new FindListRequest with given search method
   *
   * @param searchMethod                The search method for the object
   * @param options                     The [[FindListOptions]] object
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   * @return {Observable<RemoteData<PaginatedList<T>>}
   *    Return an observable that emits response from the server
   */
  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<SubmissionCcLicenceUrl>[]): Observable<RemoteData<PaginatedList<SubmissionCcLicenceUrl>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
