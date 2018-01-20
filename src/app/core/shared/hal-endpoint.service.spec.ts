import { cold, hot } from 'jasmine-marbles';
import { GlobalConfig } from '../../../config/global-config.interface';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RootEndpointRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from './hal-endpoint.service';

describe('HALEndpointService', () => {
  let service: HALEndpointService;
  let responseCache: ResponseCacheService;
  let requestService: RequestService;
  let envConfig: GlobalConfig;

  const endpointMap = {
    test: 'https://rest.api/test',
  };

  /* tslint:disable:no-shadowed-variable */
  class TestService extends HALEndpointService {
    protected linkName = 'test';

    constructor(protected responseCache: ResponseCacheService,
                protected requestService: RequestService,
                protected EnvConfig: GlobalConfig) {
      super();
    }
  }

  /* tslint:enable:no-shadowed-variable */

  describe('getEndpointMap', () => {
    beforeEach(() => {
      responseCache = jasmine.createSpyObj('responseCache', {
        get: hot('--a-', {
          a: {
            response: { endpointMap: endpointMap }
          }
        })
      });

      requestService = getMockRequestService();

      envConfig = {
        rest: { baseUrl: 'https://rest.api/' }
      } as any;

      service = new TestService(
        responseCache,
        requestService,
        envConfig
      );
    });

    it('should configure a new RootEndpointRequest', () => {
      (service as any).getEndpointMap();
      const expected = new RootEndpointRequest(requestService.generateRequestId(), envConfig);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should return an Observable of the endpoint map', () => {
      const result = (service as any).getEndpointMap();
      const expected = cold('--b-', { b: endpointMap });
      expect(result).toBeObservable(expected);
    });

  });

  describe('getEndpoint', () => {
    beforeEach(() => {
      service = new TestService(
        responseCache,
        requestService,
        envConfig
      );

      spyOn(service as any, 'getEndpointMap').and
        .returnValue(hot('--a-', { a: endpointMap }));
    });

    it('should return the endpoint URL for the service\'s linkName', () => {
      const result = service.getEndpoint();
      const expected = cold('--b-', { b: endpointMap.test });
      expect(result).toBeObservable(expected);
    });

    it('should return undefined for a linkName that isn\'t in the endpoint map', () => {
      (service as any).linkName = 'unknown';
      const result = service.getEndpoint();
      const expected = cold('--b-', { b: undefined });
      expect(result).toBeObservable(expected);
    });

  });

  describe('isEnabledOnRestApi', () => {
    beforeEach(() => {
      service = new TestService(
        responseCache,
        requestService,
        envConfig
      );

    });

    it('should return undefined as long as getEndpointMap hasn\'t fired', () => {
      spyOn(service as any, 'getEndpointMap').and
        .returnValue(hot('----'));

      const result = service.isEnabledOnRestApi();
      const expected = cold('b---', { b: undefined });
      expect(result).toBeObservable(expected);
    });

    it('should return true if the service\'s linkName is in the endpoint map', () => {
      spyOn(service as any, 'getEndpointMap').and
        .returnValue(hot('--a-', { a: endpointMap }));

      const result = service.isEnabledOnRestApi();
      const expected = cold('b-c-', { b: undefined, c: true });
      expect(result).toBeObservable(expected);
    });

    it('should return false if the service\'s linkName isn\'t in the endpoint map', () => {
      spyOn(service as any, 'getEndpointMap').and
        .returnValue(hot('--a-', { a: endpointMap }));

      (service as any).linkName = 'unknown';
      const result = service.isEnabledOnRestApi();
      const expected = cold('b-c-', { b: undefined, c: false  });
      expect(result).toBeObservable(expected);
    });

  });

});
