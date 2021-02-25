import { RootDataService } from './root-data.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { Root } from './root.model';

describe('RootDataService', () => {
  let service: RootDataService;
  let halService: HALEndpointService;
  let rootEndpoint;

  beforeEach(() => {
    rootEndpoint = 'root-endpoint';
    halService = jasmine.createSpyObj('halService', {
      getRootHref: rootEndpoint
    });
    service = new RootDataService(null, null, null, null, halService, null, null, null);
    (service as any).dataService = jasmine.createSpyObj('dataService', {
      findByHref: createSuccessfulRemoteDataObject$({})
    });
  });

  describe('findRoot', () => {
    let result$: Observable<RemoteData<Root>>;

    beforeEach(() => {
      result$ = service.findRoot();
    });

    it('should call findByHref using the root endpoint', (done) => {
      result$.subscribe(() => {
        expect((service as any).dataService.findByHref).toHaveBeenCalledWith(rootEndpoint, true, true);
        done();
      });
    });
  });
});
