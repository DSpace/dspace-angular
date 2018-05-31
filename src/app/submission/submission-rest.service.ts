import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { ResponseCacheService } from '../core/cache/response-cache.service';
import { RequestService } from '../core/data/request.service';
import { ResponseCacheEntry } from '../core/cache/response-cache.reducer';
import { ErrorResponse, RestResponse, SubmissionSuccessResponse } from '../core/cache/response-cache.models';
import { isNotEmpty } from '../shared/empty.util';
import {
  ConfigRequest,
  DeleteRequest,
  PostRequest,
  RestRequest,
  SubmissionDeleteRequest,
  SubmissionPatchRequest,
  SubmissionPostRequest,
  SubmissionRequest
} from '../core/data/request.models';
import { SubmitDataResponseDefinitionObject } from '../core/shared/submit-data-response-definition.model';
import { CoreState } from '../core/core.reducers';
import { PostPatchDataService } from '../core/data/postpatch-data.service';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';

@Injectable()
export class SubmissionRestService extends PostPatchDataService<SubmitDataResponseDefinitionObject> {
  protected linkPath = 'workspaceitems';
  protected overrideRequest = true;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService) {
    super();
  }

  protected fetchRequest(request: RestRequest): Observable<SubmitDataResponseDefinitionObject> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .do(() => this.responseCache.remove(request.href))
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(`Couldn't retrieve the data`))),
      successResponse
        .filter((response: SubmissionSuccessResponse) => isNotEmpty(response))
        .map((response: SubmissionSuccessResponse) => response.dataDefinition)
        .distinctUntilChanged());
  }

  public deleteById(scopeId: string, linkName?: string): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName || this.linkPath)
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .map((endpointURL: string) => new SubmissionDeleteRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: DeleteRequest) => this.requestService.configure(request))
      .flatMap((request: DeleteRequest) => this.submitData(request))
      .distinctUntilChanged();
  }

  public getDataByHref(href: string): Observable<any> {
    const request = new ConfigRequest(this.requestService.generateRequestId(), href);
    this.requestService.configure(request, true);

    return this.fetchRequest(request);
  }

  public getDataById(linkName: string, id: string): Observable<any> {
    return this.halService.getEndpoint(linkName)
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, id))
      .filter((href: string) => isNotEmpty(href))
      .distinctUntilChanged()
      .map((endpointURL: string) => new SubmissionRequest(this.requestService.generateRequestId(), endpointURL))
      .do((request: RestRequest) => this.requestService.configure(request, true))
      .flatMap((request: RestRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  public postToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .distinctUntilChanged()
      .map((endpointURL: string) => new SubmissionPostRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.submitData(request))
      .distinctUntilChanged();
  }

  public patchToEndpoint(linkName: string, body: any, scopeId?: string): Observable<SubmitDataResponseDefinitionObject> {
    return this.halService.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .distinctUntilChanged()
      .map((endpointURL: string) => new SubmissionPatchRequest(this.requestService.generateRequestId(), endpointURL, body))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.submitData(request))
      .distinctUntilChanged();
  }

}
