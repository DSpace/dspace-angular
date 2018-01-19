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
import { RequestConfigureAction, RequestExecuteAction } from './request.actions';
import {
  DeleteRequest,
  GetRequest,
  HeadRequest,
  OptionsRequest,
  PatchRequest,
  PostRequest,
  PutRequest
} from './request.models';
import { RequestService } from './request.service';

describe('RequestService', () => {
  let service: RequestService;
  let serviceAsAny: any;
  let objectCache: ObjectCacheService;
  let responseCache: ResponseCacheService;
  let uuidService: UUIDService;
  let store: Store<CoreState>;

  const testUUID = '5f2a0d2a-effa-4d54-bd54-5663b960f9eb';
  const testHref = 'https://rest.api/endpoint/selfLink';
  const testGetRequest = new GetRequest(testUUID, testHref);
  const testPostRequest = new PostRequest(testUUID, testHref);
  const testPutRequest = new PutRequest(testUUID, testHref);
  const testDeleteRequest = new DeleteRequest(testUUID, testHref);
  const testOptionsRequest = new OptionsRequest(testUUID, testHref);
  const testHeadRequest = new HeadRequest(testUUID, testHref);
  const testPatchRequest = new PatchRequest(testUUID, testHref);

  const defaultSelectResult = Observable.of(undefined);
  const defaultHasResponse = false;
  const defaultGetResponse = Observable.of(undefined);
  const defaultHasObjectCache = false;

  function initMockResponseCacheService(hasResponse, getResponse) {
    return jasmine.createSpyObj('responseCache', {
      has: hasResponse,
      get: getResponse
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

  function initServices(selectResult = defaultSelectResult, hasResponse = defaultHasResponse, getResponse = defaultGetResponse, hasObjectCache: boolean | boolean[] = defaultHasObjectCache) {
    if (!Array.isArray(hasObjectCache)) {
      hasObjectCache = [hasObjectCache];
    }
    objectCache = initMockObjectCacheService();
    (objectCache.hasBySelfLink as any).and.returnValues(...hasObjectCache);
    responseCache = initMockResponseCacheService(hasResponse, getResponse);
    uuidService = initMockUUIDService();
    store = initMockStore<CoreState>(selectResult);
    service = initTestService();
    serviceAsAny = service as any;
  }

  describe('generateRequestId', () => {
    beforeEach(() => {
      initServices();
    });

    it('should generate a new request ID', () => {
      const result = service.generateRequestId();
      const expected = `client/${defaultUUID}`;

      expect(result).toBe(expected);
    });
  });

  describe('isPending', () => {
    describe('before the request is configured', () => {
      beforeEach(() => {
        initServices();
      });

      it('should return false', () => {
        const result = service.isPending(testGetRequest);
        const expected = false;

        expect(result).toBe(expected);
      });
    });

    describe('when the request has been configured but hasn\'t reached the store yet', () => {
      beforeEach(() => {
        initServices();
      });

      it('should return true', () => {
        serviceAsAny.requestsOnTheirWayToTheStore = [testHref];
        const result = service.isPending(testGetRequest);
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
        const result = service.isPending(testGetRequest);
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
        const result = service.isPending(testGetRequest);
        const expected = false;

        expect(result).toBe(expected);
      });
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
          initServices();
          spyOn(serviceAsAny, 'dispatchRequest');
          spyOn(serviceAsAny, 'isCachedOrPending').and.returnValue(false);

          service.configure(testGetRequest);
          expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testGetRequest);
        });
      });
      describe('and it is already cached or pending', () => {
        it('shouldn\'t dispatch the request', () => {
          initServices();
          spyOn(serviceAsAny, 'dispatchRequest');
          spyOn(serviceAsAny, 'isCachedOrPending').and.returnValue(true);

          service.configure(testGetRequest);
          expect(serviceAsAny.dispatchRequest).not.toHaveBeenCalled();
        });
      });
    });

    describe('if the request isn\'t a GET request', () => {
      it('should dispatch the request', () => {
        initServices();
        spyOn(serviceAsAny, 'dispatchRequest');

        service.configure(testPostRequest);
        expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testPostRequest);

        service.configure(testPutRequest);
        expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testPutRequest);

        service.configure(testDeleteRequest);
        expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testDeleteRequest);

        service.configure(testOptionsRequest);
        expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testOptionsRequest);

        service.configure(testHeadRequest);
        expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testHeadRequest);

        service.configure(testPatchRequest);
        expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(testPatchRequest);
      });
    });
  });

  describe('isCachedOrPending', () => {
    describe('when the request is cached', () => {
      describe('in the ObjectCache', () => {
        it('should return true', () => {
          initServices(defaultSelectResult, true, Observable.of({
              response: {
                isSuccessful: true
              }
            }
          ), true);

          const result = serviceAsAny.isCachedOrPending(testGetRequest);
          const expected = true;

          expect(result).toEqual(expected);
        });
      });
      describe('in the responseCache', () => {
        describe('and it\'s a DSOSuccessResponse', () => {
          it('should return true if all top level links in the response are cached in the object cache', () => {
            initServices(defaultSelectResult, true, Observable.of({
                response: {
                  isSuccessful: true,
                  resourceSelfLinks: [
                    'https://rest.api/endpoint/selfLink1',
                    'https://rest.api/endpoint/selfLink2'
                  ]
                }
              }
            ), [false, true, true]);

            const result = serviceAsAny.isCachedOrPending(testGetRequest);
            const expected = true;

            expect(result).toEqual(expected);
          });
          it('should return false if not all top level links in the response are cached in the object cache', () => {
            initServices(defaultSelectResult, true, Observable.of({
                response: {
                  isSuccessful: true,
                  resourceSelfLinks: [
                    'https://rest.api/endpoint/selfLink1',
                    'https://rest.api/endpoint/selfLink2'
                  ]
                }
              }
            ), [false, true, false]);

            const result = serviceAsAny.isCachedOrPending(testGetRequest);
            const expected = false;

            expect(result).toEqual(expected);
          });
        });
        describe('and it isn\'t a DSOSuccessResponse', () => {
          it('should return true', () => {
            initServices(defaultSelectResult, true, Observable.of({
                response: {
                  isSuccessful: true
                }
              }
            ), false);

            const result = serviceAsAny.isCachedOrPending(testGetRequest);
            const expected = true;

            expect(result).toEqual(expected);
          });
        });
      });
    });

    describe('when the request is pending', () => {
      it('should return true', () => {
        initServices();
        spyOn(service, 'isPending').and.returnValue(true);

        const result = serviceAsAny.isCachedOrPending(testGetRequest);
        const expected = true;

        expect(result).toEqual(expected);
      });
    });

    describe('when the request is neither cached nor pending', () => {
      it('should return false', () => {
        initServices();

        const result = serviceAsAny.isCachedOrPending(testGetRequest);
        const expected = false;

        expect(result).toEqual(expected);
      });
    });
  });

  describe('dispatchRequest', () => {
    beforeEach(() => {
      initServices();
    });
    it('should dispatch a RequestConfigureAction', () => {
      const request = testGetRequest;
      serviceAsAny.dispatchRequest(request);
      expect(store.dispatch).toHaveBeenCalledWith(new RequestConfigureAction(request));
    });
    it('should dispatch a RequestExecuteAction', () => {
      const request = testGetRequest;
      serviceAsAny.dispatchRequest(request);
      expect(store.dispatch).toHaveBeenCalledWith(new RequestExecuteAction(request.uuid));
    });
    describe('when it\'s a GET request', () => {
      it('should track it on it\'s way to the store', () => {
        spyOn(serviceAsAny, 'trackRequestsOnTheirWayToTheStore');
        const request = testGetRequest;
        serviceAsAny.dispatchRequest(request);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).toHaveBeenCalledWith(request);
      });
    });
    describe('when it\'s not a GET request', () => {
      it('shouldn\'t track it', () => {
        spyOn(serviceAsAny, 'trackRequestsOnTheirWayToTheStore');

        serviceAsAny.dispatchRequest(testPostRequest);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).not.toHaveBeenCalled();

        serviceAsAny.dispatchRequest(testPutRequest);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).not.toHaveBeenCalled();

        serviceAsAny.dispatchRequest(testDeleteRequest);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).not.toHaveBeenCalled();

        serviceAsAny.dispatchRequest(testOptionsRequest);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).not.toHaveBeenCalled();

        serviceAsAny.dispatchRequest(testHeadRequest);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).not.toHaveBeenCalled();

        serviceAsAny.dispatchRequest(testPatchRequest);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).not.toHaveBeenCalled();
      });
    });
  });

  describe('trackRequestsOnTheirWayToTheStore', () => {
    let request: GetRequest;

    beforeEach(() => {
      initServices();
      request = testGetRequest;
    });

    describe('when the method is called with a new request', () => {
      it('should start tracking the request', () => {
        expect(serviceAsAny.requestsOnTheirWayToTheStore.includes(request.href)).toBeFalsy();
        serviceAsAny.trackRequestsOnTheirWayToTheStore(request);
        expect(serviceAsAny.requestsOnTheirWayToTheStore.includes(request.href)).toBeTruthy();
      });
    });

    describe('when the request is added to the store', () => {
      it('should stop tracking the request', () => {
        (store.select as any).and.returnValue(Observable.of({ request }));
        serviceAsAny.trackRequestsOnTheirWayToTheStore(request);
        expect(serviceAsAny.requestsOnTheirWayToTheStore.includes(request.href)).toBeFalsy();
      });
    });
  });
});
