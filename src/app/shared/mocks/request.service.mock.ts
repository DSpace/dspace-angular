import {of as observableOf,  Observable } from 'rxjs';
import { RequestService } from '../../core/data/request.service';
import { RequestEntry } from '../../core/data/request.reducer';
import SpyObj = jasmine.SpyObj;

export function getMockRequestService(requestEntry$: Observable<RequestEntry> = observableOf(new RequestEntry())): SpyObj<RequestService> {
  return jasmine.createSpyObj('requestService', {
    configure: false,
    generateRequestId: 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
    getByHref: requestEntry$,
    getByUUID: requestEntry$,
    uriEncodeBody: jasmine.createSpy('uriEncodeBody'),
    isCachedOrPending: false,
    removeByHrefSubstring: observableOf(true),
    hasByHrefObservable: observableOf(false)
  });
}
