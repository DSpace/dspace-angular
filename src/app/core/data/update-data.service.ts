import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';

import { RemoteData } from './remote-data';
import { RestRequestMethod } from './rest-request-method';

/**
 * Represents a data service to update a given object
 */
export interface UpdateDataService<T> {
  patch(dso: T, operations: Operation[]): Observable<RemoteData<T>>;
  update(object: T): Observable<RemoteData<T>>;
  commitUpdates(method?: RestRequestMethod);
}
