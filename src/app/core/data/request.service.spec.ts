import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { initMockObjectCacheService } from '../../shared/mocks/mock-object-cache.service';
import { initMockStore } from '../../shared/mocks/mock-store';
import { defaultUUID, initMockUUIDService } from '../../shared/mocks/mock-uuid.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { UUIDService } from '../shared/uuid.service';
import {
  DeleteRequest, GetRequest,
  HeadRequest,
  OptionsRequest,
  PatchRequest,
  PostRequest,
  PutRequest, RestRequest
} from './request.models';
import { RequestService } from './request.service';

describe('RequestService', () => {
  let service: RequestService;
  let objectCache: ObjectCacheService;
  let responseCache: ResponseCacheService;
  let uuidService: UUIDService;
  let store: Store<CoreState>;

  const testUUID = '5f2a0d2a-effa-4d54-bd54-5663b960f9eb';
  const testHref = 'https://rest.api/endpoint/selfLink';

  function initMockResponseCacheService() {
    return jasmine.createSpyObj('responseCache', {
      has: true,
      get: cold('b-', {
        b: {
          response: {}
        }
      })
    });
  }

  function initTestService() {
    return new RequestService(
      objectCache,
      responseCache,
      uuidService,
      store
    );
  }

  function initServices(selectResult: any) {
    objectCache = initMockObjectCacheService();
    responseCache = initMockResponseCacheService();
    uuidService = initMockUUIDService();
    store = initMockStore<CoreState>(selectResult);
    service = initTestService();
  }

  describe('generateRequestId', () => {
    beforeEach(() => {
      initServices(Observable.of(undefined));
    });

    it('should generate a new request ID', () => {
      const result = service.generateRequestId();
      const expected = `client/${defaultUUID}`;

      expect(result).toBe(expected);
    });
  });

  describe('isPending', () => {
    let testRequest: GetRequest;
    describe('before the request is configured', () => {
      beforeEach(() => {
        initServices(Observable.of(undefined));
        testRequest = new GetRequest(testUUID, testHref)
      });

      it('should return false', () => {
        const result = service.isPending(testRequest);
        const expected = false;

        expect(result).toBe(expected);
      });
    });

    describe('when the request has been configured but hasn\'t reached the store yet', () => {
      beforeEach(() => {
        initServices(Observable.of(undefined));
      });

      it('should return true', () => {
        (service as any).requestsOnTheirWayToTheStore = [testHref];
        const result = service.isPending(testRequest);
        const expected = true;

        expect(result).toBe(expected);
      });
    });

    describe('when the request has reached the store, before the server responds', () => {
      beforeEach(() => {
        initServices(Observable.of({
          completed: false
        }));
      });

      it('should return true', () => {
        const result = service.isPending(testRequest);
        const expected = true;

        expect(result).toBe(expected);
      });
    });

    describe('after the server responds', () => {
      beforeEach(() => {
        initServices(Observable.of({
          completed: true
        }));
      });

      it('should return false', () => {
        const result = service.isPending(testRequest);
        const expected = false;

        expect(result).toBe(expected);
      });
    });

    describe('getByUUID', () => {
      describe('if the request with the specified UUID exists in the store', () => {
        it('should return an Observable of the RequestEntry', () => {
          initServices(hot('a', {
            a: {
              completed: true
            }
          }));

          const result = service.getByUUID(testUUID);
          const expected = cold('b', {
            b: {
              completed: true
            }
          });

          expect(result).toBeObservable(expected);
        });
      });

      describe('if the request with the specified UUID doesn\'t exist in the store', () => {
        it('should return an Observable of undefined', () => {
          initServices(hot('a', {
            a: undefined
          }));

          const result = service.getByUUID(testUUID);
          const expected = cold('b', {
            b: undefined
          });

          expect(result).toBeObservable(expected);
        });
      });

    });

    describe('getByHref', () => {
      describe('if the request with the specified href exists in the store', () => {
        it('should return an Observable of the RequestEntry', () => {
          initServices(hot('a', {
            a: testUUID
          }));
          spyOn(service, 'getByUUID').and.returnValue(cold('b', {
            b: {
              completed: true
            }
          }));

          const result = service.getByHref(testHref);
          const expected = cold('c', {
            c: {
              completed: true
            }
          });

          expect(result).toBeObservable(expected);
        });
      });

      describe('if the request with the specified href doesn\'t exist in the store', () => {
        it('should return an Observable of undefined', () => {
          initServices(hot('a', {
            a: undefined
          }));
          spyOn(service, 'getByUUID').and.returnValue(cold('b', {
            b: undefined
          }));

          const result = service.getByHref(testHref);
          const expected = cold('c', {
            c: undefined
          });

          expect(result).toBeObservable(expected);
        });
      });
    });

    describe('configure', () => {
      describe('if the request is a GET request', () => {
        describe('and it isn\'t already cached', () => {
          it('should dispatch the request', () => {
            initServices(Observable.of(undefined));
            spyOn((service as any), 'dispatchRequest');
            spyOn((service as any), 'isCachedOrPending').and.returnValue(false);

            const request = new GetRequest(testUUID, testHref);
            service.configure(request);
            expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);
          });
        });
        describe('and it is already cached or pending', () => {
          it('shouldn\'t dispatch the request', () => {
            initServices(Observable.of(undefined));
            spyOn((service as any), 'dispatchRequest');
            spyOn((service as any), 'isCachedOrPending').and.returnValue(true);

            const request = new GetRequest(testUUID, testHref);
            service.configure(request);
            expect((service as any).dispatchRequest).not.toHaveBeenCalled();
          });
        });
      });

      describe('if the request isn\'t a GET request', () => {
        it('should dispatch the request', () => {
          initServices(Observable.of(undefined));
          spyOn((service as any), 'dispatchRequest');

          let request = new PostRequest(testUUID, testHref);
          service.configure(request);
          expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);

          request = new PutRequest(testUUID, testHref);
          service.configure(request);
          expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);

          request = new DeleteRequest(testUUID, testHref);
          service.configure(request);
          expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);

          request = new OptionsRequest(testUUID, testHref);
          service.configure(request);
          expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);

          request = new HeadRequest(testUUID, testHref);
          service.configure(request);
          expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);

          request = new PatchRequest(testUUID, testHref);
          service.configure(request);
          expect((service as any).dispatchRequest).toHaveBeenCalledWith(request);
        });
      });
    });

  });

});
