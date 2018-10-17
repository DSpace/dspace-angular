import { cold, hot } from 'jasmine-marbles';
import { GlobalConfig } from '../../../config/global-config.interface';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from './hal-endpoint.service';
import { EndpointMapRequest } from '../data/request.models';

describe('HALEndpointService', () => {
  let service: HALEndpointService;
  let requestService: RequestService;
  let envConfig: GlobalConfig;

  const endpointMap = {
    test: 'https://rest.api/test',
  };
  const linkPath = 'test';

  describe('getRootEndpointMap', () => {
    beforeEach(() => {
      requestService = getMockRequestService();

      envConfig = {
        rest: { baseUrl: 'https://rest.api/' }
      } as any;

      service = new HALEndpointService(
        requestService,
        envConfig
      );
    });

    it('should configure a new EndpointMapRequest', () => {
      (service as any).getRootEndpointMap();
      const expected = new EndpointMapRequest(requestService.generateRequestId(), envConfig.rest.baseUrl);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should return an Observable of the endpoint map', () => {
      const result = (service as any).getRootEndpointMap();
      const expected = cold('b-', { b: endpointMap });
      expect(result).toBeObservable(expected);
    });

  });

  describe('getEndpoint', () => {

    beforeEach(() => {
      envConfig = {
        rest: { baseUrl: 'https://rest.api/' }
      } as any;
    });

    it('should return the endpoint URL for the service\'s linkPath', () => {
      spyOn(service as any, 'getEndpointAt').and
        .returnValue(hot('a-', { a: 'https://rest.api/test' }));
      const result = service.getEndpoint(linkPath);

      const expected = cold('b-', { b: endpointMap.test });
      expect(result).toBeObservable(expected);
    });

    it('should return undefined for a linkPath that isn\'t in the endpoint map', () => {
      spyOn(service as any, 'getEndpointAt').and
        .returnValue(hot('a-', { a: undefined }));
      const result = service.getEndpoint('unknown');
      const expected = cold('b-', { b: undefined });
      expect(result).toBeObservable(expected);
    });
  });

  describe('isEnabledOnRestApi', () => {
    beforeEach(() => {
      service = new HALEndpointService(
        requestService,
        envConfig
      );

    });

    it('should return undefined as long as getRootEndpointMap hasn\'t fired', () => {
      spyOn(service as any, 'getRootEndpointMap').and
        .returnValue(hot('----'));

      const result = service.isEnabledOnRestApi(linkPath);
      const expected = cold('b---', { b: undefined });
      expect(result).toBeObservable(expected);
    });

    it('should return true if the service\'s linkPath is in the endpoint map', () => {
      spyOn(service as any, 'getRootEndpointMap').and
        .returnValue(hot('--a-', { a: endpointMap }));
      const result = service.isEnabledOnRestApi(linkPath);
      const expected = cold('b-c-', { b: undefined, c: true });
      expect(result).toBeObservable(expected);
    });

    it('should return false if the service\'s linkPath isn\'t in the endpoint map', () => {
      spyOn(service as any, 'getRootEndpointMap').and
        .returnValue(hot('--a-', { a: endpointMap }));

      const result = service.isEnabledOnRestApi('unknown');
      const expected = cold('b-c-', { b: undefined, c: false });
      expect(result).toBeObservable(expected);
    });

  });

});
