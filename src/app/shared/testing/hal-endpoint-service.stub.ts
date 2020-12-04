import { of as observableOf } from 'rxjs';

export class HALEndpointServiceStub {

  constructor(private url: string) {}
  getEndpoint(path: string) {
    return observableOf(this.url + '/' + path);
  }
}
