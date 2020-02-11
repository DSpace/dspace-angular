import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from './remote-data';
import { RestRequestMethod } from './rest-request-method';

/**
 * Represents a data service to update a given object
 */
export interface UpdateDataService<T> {
  update(object: T): Observable<RemoteData<T>>;
  commitUpdates(method?: RestRequestMethod);
}
