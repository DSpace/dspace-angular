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
import { ConfigRequest, HttpPostRequest, RestRequest } from '../core/data/request.models';
import { SubmitDataResponseDefinitionObject } from '../core/shared/submit-data-response-definition.model';
import { GLOBAL_CONFIG } from '../../config';
import { PostPatchRestService } from '../core/json-patch/json-patch.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core/core.reducers';

@Injectable()
export class SubmissionRestService extends PostPatchRestService<SubmitDataResponseDefinitionObject> {
  protected linkName = 'workspaceitems';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected store: Store<CoreState>) {
    super();
  }

  protected getData(request: RestRequest): Observable<SubmitDataResponseDefinitionObject> {
    const [successResponse, errorResponse] =  this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the data`))),
      successResponse
        .filter((response: SubmitDataSuccessResponse) => isNotEmpty(response))
        .map((response: SubmitDataSuccessResponse) => response.dataDefinition)
        .distinctUntilChanged());
  }

  public getDataByHref(href: string): Observable<any> {
    const request = new ConfigRequest(href);
    this.requestService.configure(request);

    return this.getData(request);
  }

}
