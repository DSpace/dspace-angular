import { of as observableOf } from 'rxjs';
import { RequestEntry } from '../../core/data/request.reducer';
export function getMockRequestService(requestEntry$) {
    if (requestEntry$ === void 0) { requestEntry$ = observableOf(new RequestEntry()); }
    return jasmine.createSpyObj('requestService', {
        configure: false,
        generateRequestId: 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
        getByHref: requestEntry$,
        getByUUID: requestEntry$,
        uriEncodeBody: jasmine.createSpy('uriEncodeBody'),
        /* tslint:disable:no-empty */
        removeByHrefSubstring: function () { }
        /* tslint:enable:no-empty */
    });
}
//# sourceMappingURL=mock-request.service.js.map