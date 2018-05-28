import { Observable } from 'rxjs/Observable';
import { SetViewMode } from '../view-mode';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class HALEndpointServiceStub {

  constructor(private url: string) {};
  getEndpoint(path: string) {
    return Observable.of(this.url + '/' + path);
  }
}
