import { HttpHeaders } from '@angular/common/http';

import { merge as observableMerge, Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';

import { DataService } from '../data/data.service';
import { DeleteRequest, FindAllOptions, PostRequest, TaskDeleteRequest, TaskPostRequest } from '../data/request.models';
import { isNotEmpty } from '../../shared/empty.util';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { ProcessTaskResponse } from './models/process-task-response';
import { RemoteDataError } from '../data/remote-data-error';
import { getResponseFromEntry } from '../shared/operators';
import { ErrorResponse, MessageResponse, RestResponse } from '../cache/response.models';
import { CacheableObject } from '../cache/object-cache.reducer';

export abstract class TasksService<T extends CacheableObject> extends DataService<T> {

  public getBrowseEndpoint(options: FindAllOptions): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  protected fetchRequest(requestId: string): Observable<ProcessTaskResponse> {
    const responses = this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry()
    );
    const errorResponses = responses.pipe(
      filter((response: RestResponse) => !response.isSuccessful),
      mergeMap((response: ErrorResponse) => observableOf(
        new ProcessTaskResponse(
          response.isSuccessful,
          new RemoteDataError(response.statusCode, response.statusText, response.errorMessage)
        ))
      ));
    const successResponses = responses.pipe(
      filter((response: RestResponse) => response.isSuccessful),
      map((response: MessageResponse) => new ProcessTaskResponse(response.isSuccessful)),
      distinctUntilChanged()
    );
    return observableMerge(errorResponses, successResponses);
  }

  protected getEndpointByIDHref(endpoint, resourceID): string {
    return isNotEmpty(resourceID) ? `${endpoint}/${resourceID}` : `${endpoint}`;
  }

  protected getEndpointByMethod(endpoint: string, method: string): string {
    return isNotEmpty(method) ? `${endpoint}/${method}` : `${endpoint}`;
  }

  public postToEndpoint(linkPath: string, body: any, scopeId?: string, options?: HttpOptions): Observable<ProcessTaskResponse> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      distinctUntilChanged(),
      map((endpointURL: string) => new TaskPostRequest(requestId, endpointURL, body, options)),
      tap((request: PostRequest) => this.requestService.configure(request)),
      flatMap((request: PostRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  public deleteById(linkName: string, scopeId: string, options?: HttpOptions): Observable<ProcessTaskResponse> {
    const requestId = this.requestService.generateRequestId();
    return this.halService.getEndpoint(linkName || this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)),
      map((endpointURL: string) => new TaskDeleteRequest(requestId, endpointURL, null, options)),
      tap((request: DeleteRequest) => this.requestService.configure(request)),
      flatMap((request: DeleteRequest) => this.fetchRequest(requestId)),
      distinctUntilChanged());
  }

  protected makeHttpOptions() {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    return options;
  }
}
