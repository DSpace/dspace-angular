import { Injectable } from '@angular/core';

import { EpersonService } from './eperson.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { isNotEmpty } from '../../shared/empty.util';
import { EpersonRequest, GetRequest } from '../data/request.models';
import { EpersonData } from './eperson-data';
import { EpersonSuccessResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { Observable } from 'rxjs/Observable';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { BrowseService } from '../browse/browse.service';

@Injectable()
export class GroupEpersonService extends EpersonService {
  protected linkPath = 'groups';
  protected browseEndpoint = '';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected bs: BrowseService,
    protected halService: HALEndpointService) {
    super();
  }

  protected getSearchHref(endpoint, groupName): string {
    return `${endpoint}/search/isMemberOf?groupName=${groupName}`;
  }

  isMemberOf(groupName: string) {
    return this.halService.getEndpoint(this.linkPath)
      .map((endpoint: string) => this.getSearchHref(endpoint, groupName))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new EpersonRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: GetRequest) => this.requestService.configure(request))
      .flatMap((request: GetRequest) => this.getSearch(request))
      .distinctUntilChanged();
  }

  protected getSearch(request: GetRequest): Observable<EpersonData> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.of(new EpersonData(undefined, undefined))),
      successResponse
        .filter((response: EpersonSuccessResponse) => isNotEmpty(response))
        .map((response: EpersonSuccessResponse) => new EpersonData(response.pageInfo, response.epersonDefinition))
        .distinctUntilChanged());
  }
}
