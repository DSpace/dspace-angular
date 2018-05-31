import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isNotEmpty } from '../../shared/empty.util';
import { ErrorResponse, PostPatchSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RestRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { CoreState } from '../core.reducers';
import { Store } from '@ngrx/store';

@Injectable()
export abstract class PostPatchDataService<ResponseDefinitionDomain> {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract store: Store<CoreState>;
  protected abstract linkPath: string;
  protected abstract halService: HALEndpointService;
  protected abstract overrideRequest = false;

  protected submitData(request: RestRequest): Observable<ResponseDefinitionDomain> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't send data to server`))),
      successResponse
        .filter((response: PostPatchSuccessResponse) => isNotEmpty(response))
        .map((response: PostPatchSuccessResponse) => response.dataDefinition)
        .distinctUntilChanged());
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

}
