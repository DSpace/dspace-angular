import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from './remote-data';
import { RestRequestMethod } from './rest-request-method';
import { Operation } from 'fast-json-patch';
import { RestResponse } from '../cache/response.models';

/**
 * Represents a data service to update a given object
 */
export interface UpdateDataService<T> {
  patch(dso: T, operations: Operation[]): Observable<RestResponse>;
  update(object: T): Observable<RemoteData<T>>;
  commitUpdates(method?: RestRequestMethod);
}
