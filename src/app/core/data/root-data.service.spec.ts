import { RootDataService } from './root-data.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  createSuccessfulRemoteDataObject$
} from '../../shared/remote-data.utils';
import { Observable } from 'rxjs';
import { RemoteData } from './remote-data';
import { Root } from './root.model';

describe('RootDataService', () => {
  let service: RootDataService;
  let halService: HALEndpointService;
  let requestService;
  let rootEndpoint;
  let findByHrefSpy;

  beforeEach(() => {
    rootEndpoint = 'root-endpoint';
    halService = jasmine.createSpyObj('halService', {
      getRootHref: rootEndpoint,
    });
    requestService = jasmine.createSpyObj('halService', {
      setStaleByHref: {},
    });
    service = new RootDataService(requestService, null, null, halService);

    findByHrefSpy = spyOn(service as any, 'findByHref');
    findByHrefSpy.and.returnValue(createSuccessfulRemoteDataObject$({}));
  });

  describe('findRoot', () => {
    let result$: Observable<RemoteData<Root>>;

    beforeEach(() => {
      result$ = service.findRoot();
    });

    it('should call findByHref using the root endpoint', (done) => {
      result$.subscribe(() => {
        expect(findByHrefSpy).toHaveBeenCalledWith(rootEndpoint, true, true);
        done();
      });
    });
  });

  describe('invalidateRootCache', () => {
    it('should call setStaleByHrefSubstring with the root endpoint href', () => {
      service.invalidateRootCache();

      expect(halService.getRootHref).toHaveBeenCalled();
      expect(requestService.setStaleByHref).toHaveBeenCalledWith(rootEndpoint);
    });
  });


});
