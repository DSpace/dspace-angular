import { cold, hot } from 'jasmine-marbles';
import { GlobalConfig } from '../../../config/global-config.interface';
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

    constructor(
      protected responseCache: ResponseCacheService,
      protected requestService: RequestService,
      protected EnvConfig: GlobalConfig) {
      super();
    }
  }
  /* tslint:enable:no-shadowed-variable */

  describe('getEndpointMap', () => {
    beforeEach(() => {
      responseCache = jasmine.createSpyObj('responseCache', {
        get: hot('--a-', { a: {
          response: { endpointMap: endpointMap }
        }})
      });

      requestService = jasmine.createSpyObj('requestService', ['configure']);

      envConfig = {
        rest: { baseUrl: 'https://rest.api/' }
      } as any;

      service = new TestService(
        responseCache,
        requestService,
        envConfig
      );
    });

    it('should configure a new RootEndpointRequest', (done) => {
      (service as any).getEndpointMap();
      const expected = new RootEndpointRequest(envConfig);
      setTimeout(() => {
        expect(requestService.configure).toHaveBeenCalledWith(expected);
        done();
      }, 0);
    });

    it('should return an Observable of the endpoint map', () => {
      const result = (service as any).getEndpointMap();
      const expected = cold('--b-', { b: endpointMap });
      expect(result).toBeObservable(expected);
    });

  });

});
