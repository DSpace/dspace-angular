import { RequestService } from '../../core/data/request.service';
import { RequestEntry } from '../../core/data/request.reducer';

export function getMockRequestService(): RequestService {
  return jasmine.createSpyObj('requestService', {
    configure: () => false,
    generateRequestId: () => 'clients/b186e8ce-e99c-4183-bc9a-42b4821bdb78',
    getByHref: (uuid: string) => new RequestEntry()
  });
}
