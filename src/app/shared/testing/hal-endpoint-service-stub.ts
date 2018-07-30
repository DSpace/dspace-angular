import { Observable } from 'rxjs/Observable';

export class HALEndpointServiceStub {

  constructor(private url: string) {};
  getEndpoint(path: string) {
    return Observable.of(this.url + '/' + path);
  }
}
