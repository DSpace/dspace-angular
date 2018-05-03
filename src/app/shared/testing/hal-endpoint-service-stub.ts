import { Observable } from 'rxjs/Observable';
import { ViewMode } from '../../+search-page/search-options.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class HALEndpointServiceStub {

  constructor(private url: string) {};
  getEndpoint(path: string) {
    return Observable.of(this.url + '/' + path);
  }
}
