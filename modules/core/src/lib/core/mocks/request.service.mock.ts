import {
  Observable,
  of as observableOf,
} from 'rxjs';

import {
  RequestEntry,
  RequestService,
} from '../data';
import SpyObj = jasmine.SpyObj;

export function getMockRequestService(requestEntry$: Observable<RequestEntry> = observableOf(new RequestEntry())): SpyObj<RequestService> {
  return jasmine.createSpyObj('requestService', {
    send: false,
    generateRequestId: 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
    getByHref: requestEntry$,
    getByUUID: requestEntry$,
    uriEncodeBody: jasmine.createSpy('uriEncodeBody'),
    isCachedOrPending: false,
    removeByHrefSubstring: observableOf(true),
    setStaleByHrefSubstring: observableOf(true),
    setStaleByUUID: observableOf(true),
    hasByHref$: observableOf(false),
    shouldDispatchRequest: true,
  });
}
