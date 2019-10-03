import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from './remote-data';
import { RestRequestMethod } from './rest-request-method';

export interface UpdateDataService<T> {
  update(object: T): Observable<RemoteData<T>>;
  commitUpdates(method?: RestRequestMethod);
}
