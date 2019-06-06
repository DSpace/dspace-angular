import {of as observableOf,  Observable } from 'rxjs';
import { RequestService } from '../../core/data/request.service';
import { RequestEntry } from '../../core/data/request.reducer';

export function getMockRequestService(requestEntry$: Observable<RequestEntry> = observableOf(new RequestEntry())): RequestService {
  return jasmine.createSpyObj('requestService', {
    configure: false,
    generateRequestId: 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
    getByHref: requestEntry$,
    getByUUID: requestEntry$,
    uriEncodeBody: jasmine.createSpy('uriEncodeBody'),
    /* tslint:disable:no-empty */
    removeByHrefSubstring: () => {}
    /* tslint:enable:no-empty */
  });
}
