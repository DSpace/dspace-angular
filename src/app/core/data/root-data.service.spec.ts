import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteData } from './remote-data';
import { Root } from './root.model';
import { RootDataService } from './root-data.service';

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
    requestService = jasmine.createSpyObj('requestService', [
      'setStaleByHref',
    ]);
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

  describe('checkServerAvailability', () => {
    let result$: Observable<boolean>;

    it('should return observable of true when root endpoint is available', () => {
      spyOn(service, 'findRoot').and.returnValue(createSuccessfulRemoteDataObject$<Root>({} as any));

      result$ = service.checkServerAvailability();

      expect(result$).toBeObservable(cold('(a|)', {
        a: true,
      }));
    });

    it('should return observable of false when root endpoint is not available', () => {
      spyOn(service, 'findRoot').and.returnValue(createFailedRemoteDataObject$<Root>('500'));

      result$ = service.checkServerAvailability();

      expect(result$).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });

  });

  describe(`invalidateRootCache`, () => {
    it(`should set the cached root request to stale`, () => {
      service.invalidateRootCache();
      expect(halService.getRootHref).toHaveBeenCalled();
      expect(requestService.setStaleByHref).toHaveBeenCalledWith(rootEndpoint);
    });
  });
});
