import {
  Observable,
  of,
} from 'rxjs';

import { RequestService } from '../../core/data/request.service';
import SpyObj = jasmine.SpyObj;
import { RequestEntry } from '../../core/data/request-entry.model';

export function getMockRequestService(requestEntry$: Observable<RequestEntry> = of(new RequestEntry())): SpyObj<RequestService> {
  return jasmine.createSpyObj('requestService', {
    send: false,
    generateRequestId: 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
    getByHref: requestEntry$,
    getByUUID: requestEntry$,
    uriEncodeBody: jasmine.createSpy('uriEncodeBody'),
    isCachedOrPending: false,
    removeByHrefSubstring: of(true),
    setStaleByHrefSubstring: of(true),
    setStaleByUUID: of(true),
    hasByHref$: of(false),
    shouldDispatchRequest: true,
  });
}
