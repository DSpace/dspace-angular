import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import {
  BrowseSuccessResponse, ErrorResponse, PostPatchSuccessResponse,
  RestResponse
} from '../cache/response-cache.models';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { BrowseEndpointRequest, HttpPatchRequest, HttpPostRequest, RestRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { CoreState } from '../core.reducers';
import { Store } from '@ngrx/store';
import { jsonPatchOperationsByResourceType, jsonPatchOperationsByResourcId } from './selectors';
import {
  JsonPatchOperationObject, JsonPatchOperationsEntry,
  JsonPatchOperationsResourceEntry
} from './json-patch-operations.reducer';
import {
  CommitPatchOperationsAction, RollbacktPatchOperationsAction,
  StartTransactionPatchOperationsAction
} from './json-patch-operations.actions';

@Injectable()
export abstract class PostPatchRestService<ResponseDefinitionDomain> extends HALEndpointService {
  protected abstract responseCache: ResponseCacheService;
  protected abstract requestService: RequestService;
  protected abstract linkName: string;
  protected abstract EnvConfig: GlobalConfig;
  protected abstract store: Store<CoreState>;

  protected submitData(request: RestRequest): Observable<ResponseDefinitionDomain> {
    const [successResponse, errorResponse] =  this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the config`))),
      successResponse
        .filter((response: PostPatchSuccessResponse) => isNotEmpty(response))
        .map((response: PostPatchSuccessResponse) => response.body)
        .distinctUntilChanged());
  }

  protected submitJsonPatchOperations(resourceType: string, resourceId?: string, linkName?: string,) {
    return this.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .flatMap((endpointURL: string) => {
        return this.store.select(jsonPatchOperationsByResourceType(resourceType))
          .take(1)
          .filter((operationsList: JsonPatchOperationsResourceEntry) => isNotEmpty(operationsList))
          .do(() => new StartTransactionPatchOperationsAction(resourceType, resourceId, new Date().getTime()))
          .map((operationsList: JsonPatchOperationsResourceEntry)  => {
            let body: JsonPatchOperationObject[] = [];
            if (isNotEmpty(resourceId)) {
              body = operationsList[resourceId].body
            } else {
              Object.keys(operationsList)
                .filter((key) => operationsList.hasOwnProperty(key))
                .filter((key) => hasValue(operationsList[key]))
                .filter((key) => hasValue(operationsList[key].body))
                .forEach((key) => {
                  body = body.concat(operationsList[key].body)
                })
            }
            return new HttpPatchRequest(endpointURL, body);
          });
      })
      .do((request: HttpPatchRequest) => this.requestService.configure(request))
      .flatMap((request: HttpPatchRequest) => {
        const [successResponse, errorResponse] =  this.responseCache.get(request.href)
          .map((entry: ResponseCacheEntry) => entry.response)
          .partition((response: RestResponse) => response.isSuccessful);
        return Observable.merge(
          errorResponse
            .do(() => new RollbacktPatchOperationsAction(resourceType, resourceId))
            .flatMap((response: ErrorResponse) => Observable.throw(new Error(`Couldn't retrieve the config`))),
          successResponse
            .filter((response: PostPatchSuccessResponse) => isNotEmpty(response))
            .do(() => new CommitPatchOperationsAction(resourceType, resourceId))
            .map((response: PostPatchSuccessResponse) => response.body)
            .distinctUntilChanged());
      })
  }

  public postToEndpoint(linkName: string, body: any): Observable<ResponseDefinitionDomain>  {
    return this.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new HttpPostRequest(endpointURL, body))
      .do((request: HttpPostRequest) => this.requestService.configure(request))
      .flatMap((request: HttpPostRequest) => this.submitData(request))
      .distinctUntilChanged();
  }

  public patchToEndpoint(linkName: string, body: any): Observable<ResponseDefinitionDomain>  {
    return this.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new HttpPostRequest(endpointURL, body))
      .do((request: HttpPostRequest) => this.requestService.configure(request))
      .flatMap((request: HttpPostRequest) => this.submitData(request))
      .distinctUntilChanged();
  }

  public jsonPatchbyResourceType(resourceType: string) {
    return this.submitJsonPatchOperations(resourceType);
  }

  public jsonPatchbyResourceID(resourceType: string, resourceId: string) {
    return this.submitJsonPatchOperations(resourceType);
  }
}
