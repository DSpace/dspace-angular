import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { GlobalConfig } from '../../../config/global-config.interface';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from './hal-endpoint.service';
import { EndpointMapRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { of as observableOf } from 'rxjs';

describe('HALEndpointService', () => {
  let service: HALEndpointService;
  let requestService: RequestService;
  let envConfig: GlobalConfig;
  let requestEntry;

  const endpointMap = {
    test: 'https://rest.api/test',
    foo: 'https://rest.api/foo',
    bar: 'https://rest.api/bar',
    endpoint: 'https://rest.api/endpoint',
    link: 'https://rest.api/link',
    another: 'https://rest.api/another',
  };
  const start = 'http://start.com';
  const one = 'http://one.com';
  const two = 'http://two.com';
  const endpointMaps = {
    [start]: {
      one: one,
      two: 'empty',
      endpoint: 'https://rest.api/endpoint',
      link: 'https://rest.api/link',
      another: 'https://rest.api/another',
    },
    [one]: {
      one: 'empty',
      two: two,
      bar: 'https://rest.api/bar',
    }
  };
  const linkPath = 'test';

  beforeEach(() => {
    requestEntry = {
      request: { responseMsToLive: 1000 } as any,
      requestPending: false,
      responsePending: false,
      completed: true,
      response: { endpointMap: endpointMap } as any
    } as RequestEntry;
    requestService = getMockRequestService(observableOf(requestEntry));

    envConfig = {
      rest: { baseUrl: 'https://rest.api/' }
    } as any;

    service = new HALEndpointService(
      requestService,
      envConfig
    );
  });

  describe('getRootEndpointMap', () => {

    it('should configure a new EndpointMapRequest', () => {
      (service as any).getRootEndpointMap();
      const expected = new EndpointMapRequest(requestService.generateRequestId(), envConfig.rest.baseUrl);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should return an Observable of the endpoint map', () => {
      const result = (service as any).getRootEndpointMap();
      const expected = '(b|)';
      getTestScheduler().expectObservable(result).toBe(expected, { b: endpointMap });
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

  describe('getEndpointAt', () => {
    it('should throw an error when the list of hal endpoint names is empty', () => {
      const endpointAtWithoutEndpointNames = () => {
        (service as any).getEndpointAt('')
      };
      expect(endpointAtWithoutEndpointNames).toThrow();
    });

    it('should be at least called as many times as the length of halNames', () => {
      spyOn(service as any, 'getEndpointMapAt').and.returnValue(observableOf(endpointMap));
      spyOn((service as any), 'getEndpointAt').and.callThrough();

      (service as any).getEndpointAt('', 'endpoint').subscribe();

      expect((service as any).getEndpointAt.calls.count()).toEqual(1);

      (service as any).getEndpointAt.calls.reset();

      (service as any).getEndpointAt('', 'endpoint', 'another').subscribe();

      expect((service as any).getEndpointAt.calls.count()).toBeGreaterThanOrEqual(2);

      (service as any).getEndpointAt.calls.reset();

      (service as any).getEndpointAt('', 'endpoint', 'another', 'foo', 'bar', 'test').subscribe();

      expect((service as any).getEndpointAt.calls.count()).toBeGreaterThanOrEqual(5);
    });

    it('should return the correct endpoint', () => {
      spyOn(service as any, 'getEndpointMapAt').and.callFake((param) => {
        return observableOf(endpointMaps[param]);
      });

      (service as any).getEndpointAt(start, 'one').subscribe((endpoint) => {
        expect(endpoint).toEqual(one);
      });

      (service as any).getEndpointAt(start, 'one', 'two').subscribe((endpoint) => {
        expect(endpoint).toEqual(two);
      });
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
