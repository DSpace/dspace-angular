import { of } from 'rxjs';

import { hasValue } from '../../../config/utils/empty.util';

export class HALEndpointServiceStub {

  constructor(private url: string) {}
  getEndpoint(path: string, startHref?: string) {
    if (hasValue(startHref)) {
      return of(startHref + '/' + path);
    }
    return of(this.url + '/' + path);
  }
}
