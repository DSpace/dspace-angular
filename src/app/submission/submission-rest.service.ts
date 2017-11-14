import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { ResponseCacheService } from '../core/cache/response-cache.service';
import { RequestService } from '../core/data/request.service';
import { GlobalConfig } from '../../config/global-config.interface';
import { ResponseCacheEntry } from '../core/cache/response-cache.reducer';
import {
  ErrorResponse, RestResponse,
  SubmitDataSuccessResponse
} from '../core/cache/response-cache.models';
import { isNotEmpty } from '../shared/empty.util';
import { HttpPostRequest, RestRequest } from '../core/data/request.models';
import { SubmitDataResponseDefinitionObject } from '../core/shared/submit-data-response-definition.model';
import { GLOBAL_CONFIG } from '../../config';

@Injectable()
export class SubmissionRestService extends HALEndpointService {
  protected linkName: string;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
    super();
  }

  protected submitData(request: RestRequest): Observable<SubmitDataResponseDefinitionObject> {
    const [successResponse, errorResponse] =  this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the config`))),
      successResponse
      .filter((response: SubmitDataSuccessResponse) => isNotEmpty(response))
      .map((response: SubmitDataSuccessResponse) => response.dataDefinition)
      .distinctUntilChanged());
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return `${endpoint}/${resourceID}`;
  }

  public postToEndpoint(linkName: string, body: any) {
    return this.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new HttpPostRequest(endpointURL, body))
      .do((request: HttpPostRequest) => this.requestService.configure(request))
      .flatMap((request: HttpPostRequest) => this.submitData(request))
      .distinctUntilChanged();
  }

}
