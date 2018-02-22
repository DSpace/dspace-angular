import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';

import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { NormalizedClaimedTask } from './models/normalized-claimed-task-object.model';
import { ClaimedTask } from './models/claimed-task-object.model';
import { ErrorResponse, RestResponse, TaskResponse } from '../cache/response-cache.models';
import { HttpHeaders } from '@angular/common/http';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { DeleteRequest, PostRequest, RestRequest, TaskDeleteRequest, TaskPostRequest } from '../data/request.models';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';

@Injectable()
export class ClaimedTaskDataService extends DataService<NormalizedClaimedTask, ClaimedTask> {
  protected linkName = 'claimedtasks';
  protected overrideRequest = true;

  constructor(protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected store: Store<CoreState>,
              @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
              private bs: BrowseService) {
    super(NormalizedClaimedTask);
  }

  public approveTask(body: any, scopeId: string ): Observable<any> {
    return this.postToEndpoint('', this.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public rejectTask(body: any, scopeId: string ): Observable<any> {
    return this.postToEndpoint('', this.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public returnToPoolTask(body: any, scopeId: string ): Observable<any> {
    return this.deleteToEndpoint('', this.prepareBody(body), scopeId, this.makeHttpOptions());
  }

  public getScopedEndpoint(scopeID: string): Observable<string> {
    return this.getEndpoint();
  }

  protected fetchRequest(request: RestRequest): Observable<any> {
    const [successResponse, errorResponse] = this.responseCache.get(request.href)
      .map((entry: ResponseCacheEntry) => entry.response)
      .do(() => this.responseCache.remove(request.href))
      .partition((response: RestResponse) => response.isSuccessful);
    return Observable.merge(
      errorResponse.flatMap((response: ErrorResponse) =>
        Observable.throw(new Error(response.errorMessage))),
      successResponse
        .map((response: TaskResponse) => response)
        .distinctUntilChanged());
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  protected postToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<any> {
    return this.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .distinctUntilChanged()
      .map((endpointURL: string) => new TaskPostRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: PostRequest) => this.requestService.configure(request, true))
      .flatMap((request: PostRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  protected deleteToEndpoint(linkName: string, body: any, scopeId?: string, options?: HttpOptions): Observable<any> {
    return this.getEndpoint(linkName)
      .filter((href: string) => isNotEmpty(href))
      .map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId))
      .distinctUntilChanged()
      .map((endpointURL: string) => new TaskDeleteRequest(this.requestService.generateRequestId(), endpointURL, body, options))
      .do((request: DeleteRequest) => this.requestService.configure(request, true))
      .flatMap((request: DeleteRequest) => this.fetchRequest(request))
      .distinctUntilChanged();
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  protected prepareBody(body: any) {
    let queryParams = '';
    if (isNotEmpty(body) && typeof body === 'object') {
      Object.keys(body)
        .forEach((param) => {
          const paramValue = `${param}=${body[param]}`;
          queryParams = isEmpty(queryParams) ? queryParams.concat(paramValue) : queryParams.concat('&', paramValue);
        });
    }
    return encodeURI(queryParams);
  }

  protected makeHttpOptions() {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    options.headers = headers;
    return options;
  }
}
