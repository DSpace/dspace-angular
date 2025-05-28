import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from './hal-endpoint.service';
import { EndpointMapRequest } from '../data/request.models';
import { combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { TestScheduler } from 'rxjs/testing';
import { RemoteData } from '../data/remote-data';
import { RequestEntryState } from '../data/request-entry-state.model';

describe('HALEndpointService', () => {
  let service: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let envConfig;
  let testScheduler;
  let remoteDataMocks;
  const endpointMap = {
    test: {
      href: 'https://rest.api/test'
    },
    foo: {
      href: 'https://rest.api/foo'
    },
    bar: {
      href: 'https://rest.api/bar'
    },
    endpoint: {
      href: 'https://rest.api/endpoint'
    },
    link: {
      href: 'https://rest.api/link'
    },
    another: {
      href: 'https://rest.api/another'
    },
  };
  const start = 'http://start.com';
  const one = 'http://one.com';
  const two = 'http://two.com';
  const endpointMaps = {
    [start]: {
      one: {
        href: one
      },
      two: {
        href: 'empty'
      },
      endpoint: {
        href: 'https://rest.api/endpoint'
      },
      link: {
        href: 'https://rest.api/link'
      },
      another: {
        href: 'https://rest.api/another'
      },
    },
    [one]: {
      one: {
        href: 'empty',
      },
      two: {
        href: two,
      },
      bar: {
        href: 'https://rest.api/bar',
      }
    }
  };
  const linkPath = 'test';

  const timeStamp = new Date().getTime();
  const msToLive = 15 * 60 * 1000;
  const payload = {
    _links: endpointMaps[one]
  };
  const statusCodeSuccess = 200;
  const statusCodeError = 404;
  const errorMessage = 'not found';
  remoteDataMocks = {
    RequestPending: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
    ResponsePending: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
    ResponsePendingStale: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.ResponsePendingStale, undefined, undefined, undefined),
    Success: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.Success, undefined, payload, statusCodeSuccess),
    SuccessStale: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.SuccessStale, undefined, payload, statusCodeSuccess),
    Error: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.Error, errorMessage, undefined, statusCodeError),
    ErrorStale: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.ErrorStale, errorMessage, undefined, statusCodeError),
  };

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).toEqual(expected);
    });
    requestService = getMockRequestService();
    rdbService = jasmine.createSpyObj('rdbService', {
      buildFromHref: createSuccessfulRemoteDataObject$({
        _links: endpointMap
      })
    });

    envConfig = {
      rest: { baseUrl: 'https://rest.api/' }
    } as any;

    service = new HALEndpointService(
      requestService,
      rdbService
    );
  });

  describe('getRootEndpointMap', () => {
    it('should send a new EndpointMapRequest', () => {
      (service as any).getRootEndpointMap();
      const expected = new EndpointMapRequest(requestService.generateRequestId(), `${environment.rest.baseUrl}/api`);
      expect(requestService.send).toHaveBeenCalledWith(expected, true);
    });

    it('should return an Observable of the endpoint map', (done) => {
      (service as any).getRootEndpointMap().subscribe((result) => {
        expect(result).toEqual(endpointMap);
        done();
      });
    });

  });

  describe('getEndpoint', () => {

    beforeEach(() => {
      envConfig = {
        rest: { baseUrl: 'https://rest.api/' }
      } as any;
    });

    it(`should return the endpoint URL for the service's linkPath`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service as any, 'getEndpointAt').and
          .returnValue(cold('a-', { a: 'https://rest.api/test' }));
        const result = service.getEndpoint(linkPath);

        const expected = '(b|)';
        const values = {
          b: endpointMap.test.href
        };
        expectObservable(result).toBe(expected, values);
      });
    });

    it('should return undefined for a linkPath that isn\'t in the endpoint map', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service as any, 'getEndpointAt').and
          .returnValue(cold('a-', { a: undefined }));
        const result = service.getEndpoint('unknown');
        const expected = '(b|)';
        const values = { b: undefined };
        expectObservable(result).toBe(expected, values);
      });
    });
  });

  describe('getEndpointAt', () => {
    it('should throw an error when the list of hal endpoint names is empty', () => {
      const endpointAtWithoutEndpointNames = () => {
        (service as any).getEndpointAt('');
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

    it('should return the correct endpoint', (done) => {
      spyOn(service as any, 'getEndpointMapAt').and.callFake((param) => {
        return observableOf(endpointMaps[param]);
      });

      observableCombineLatest<string[]>([
        (service as any).getEndpointAt(start, 'one'),
        (service as any).getEndpointAt(start, 'one', 'two'),
      ]).subscribe(([endpoint1, endpoint2]) => {
        expect(endpoint1).toEqual(one);
        expect(endpoint2).toEqual(two);
        done();
      });
    });
  });

  describe('isEnabledOnRestApi', () => {
    beforeEach(() => {
      service = new HALEndpointService(
        requestService,
        rdbService
      );

    });

    it('should return undefined as long as getRootEndpointMap hasn\'t fired', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service as any, 'getRootEndpointMap').and
          .returnValue(cold('----'));

        const result = service.isEnabledOnRestApi(linkPath);
        const expected = 'b---';
        const values = { b: undefined };
        expectObservable(result).toBe(expected, values);
      });
    });

    it('should return true if the service\'s linkPath is in the endpoint map', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service as any, 'getRootEndpointMap').and
          .returnValue(cold('--a-', { a: endpointMap }));
        const result = service.isEnabledOnRestApi(linkPath);
        const expected = 'b-c-';
        const values = { b: undefined, c: true };
        expectObservable(result).toBe(expected, values);
      });
    });

    it('should return false if the service\'s linkPath isn\'t in the endpoint map', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        spyOn(service as any, 'getRootEndpointMap').and
          .returnValue(cold('--a-',  { a: endpointMap }));

        const result = service.isEnabledOnRestApi('unknown');
        const expected = 'b-c-';
        const values = { b: undefined, c: false };
        expectObservable(result).toBe(expected, values);
      });
    });

  });

  describe(`getEndpointMapAt`, () => {
    const href = 'https://rest.api/some/sub/path';

    it(`should call requestService.send with a new EndpointMapRequest for the given href. useCachedVersionIfAvailable should be true`, () => {
      testScheduler.run(() => {
        (service as any).getEndpointMapAt(href);
      });
      const expected = new EndpointMapRequest(requestService.generateRequestId(), href);
      expect(requestService.send).toHaveBeenCalledWith(expected, true);
    });

    it(`should call rdbService.buildFromHref with the given href`, () => {
      testScheduler.run(() => {
        (service as any).getEndpointMapAt(href);
      });
      expect(rdbService.buildFromHref).toHaveBeenCalledWith(href);
    });

    describe(`when the RemoteData returned from rdbService is stale`, () => {
      it(`should re-request it`, () => {
        spyOn(service as any, 'getEndpointMapAt').and.callThrough();
          testScheduler.run(({ cold }) => {
            (rdbService.buildFromHref as jasmine.Spy).and.returnValue(cold('a', { a: remoteDataMocks.ResponsePendingStale }));
            // we need to subscribe to the result, to ensure the "tap" that does the re-request can fire
            (service as any).getEndpointMapAt(href).subscribe();
          });
          expect((service as any).getEndpointMapAt).toHaveBeenCalledTimes(2);
      });
    });

    describe(`when the RemoteData returned from rdbService isn't stale`, () => {
      it(`should not re-request it`, () => {
        spyOn(service as any, 'getEndpointMapAt').and.callThrough();
          testScheduler.run(({ cold }) => {
            (rdbService.buildFromHref as jasmine.Spy).and.returnValue(cold('a', { a: remoteDataMocks.ResponsePending }));
            // we need to subscribe to the result, to ensure the "tap" that does the re-request can fire
            (service as any).getEndpointMapAt(href).subscribe();
          });
          expect((service as any).getEndpointMapAt).toHaveBeenCalledTimes(1);
      });
    });

    it(`should emit exactly once, returning the endpoint map in the response, when the RemoteData completes`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        (rdbService.buildFromHref as jasmine.Spy).and.returnValue(cold('a-b-c-d-e-f-g-h-i-j-k-l', {
          a: remoteDataMocks.RequestPending,
          b: remoteDataMocks.ResponsePending,
          c: remoteDataMocks.ResponsePendingStale,
          d: remoteDataMocks.SuccessStale,
          e: remoteDataMocks.RequestPending,
          f: remoteDataMocks.ResponsePending,
          g: remoteDataMocks.Success,
          h: remoteDataMocks.SuccessStale,
          i: remoteDataMocks.RequestPending,
          k: remoteDataMocks.ResponsePending,
          l: remoteDataMocks.Error,
        }));
        const expected = '------------(g|)';
        const values = {
          g: endpointMaps[one]
        };
        expectObservable((service as any).getEndpointMapAt(one)).toBe(expected, values);
      });
    });

    it(`should emit undefined when the response doesn't have a payload`, () => {
      testScheduler.run(({ cold, expectObservable }) => {
        (rdbService.buildFromHref as jasmine.Spy).and.returnValue(cold('a', {
          a: remoteDataMocks.Error,
        }));
        const expected = '(a|)';
        const values = {
          g: undefined
        };
        expectObservable((service as any).getEndpointMapAt(href)).toBe(expected, values);
      });
    });

  });

});
