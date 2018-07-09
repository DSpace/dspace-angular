import { Observable } from 'rxjs/Observable';
import { RequestService } from '../../core/data/request.service';
import { RequestEntry } from '../../core/data/request.reducer';

export function getMockRequestService(getByHref$: Observable<RequestEntry> = Observable.of(new RequestEntry())): RequestService {
  return jasmine.createSpyObj('requestService', {
    configure: false,
    generateRequestId: 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
    getByHref: getByHref$
  });
}
