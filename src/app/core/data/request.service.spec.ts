import * as ngrx from '@ngrx/store';
import { ActionsSubject, Store } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { getMockObjectCacheService } from '../../shared/mocks/mock-object-cache.service';
import { getMockResponseCacheService } from '../../shared/mocks/mock-response-cache.service';
import { defaultUUID, getMockUUIDService } from '../../shared/mocks/mock-uuid.service';
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
  PutRequest,
  RestRequest
} from './request.models';
import { RequestService } from './request.service';
import { TestScheduler } from 'rxjs/testing';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

describe('RequestService', () => {
  let scheduler: TestScheduler;
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
  let selectSpy;
  beforeEach(() => {
    scheduler = getTestScheduler();

    objectCache = getMockObjectCacheService();
    (objectCache.hasBySelfLink as any).and.returnValue(false);

    responseCache = getMockResponseCacheService();
    (responseCache.has as any).and.returnValue(false);
    (responseCache.get as any).and.returnValue(observableOf(undefined));

    uuidService = getMockUUIDService();

    store = new Store<CoreState>(new BehaviorSubject({}), new ActionsSubject(), null);
    selectSpy = spyOnProperty(ngrx, 'select');
    selectSpy.and.callFake(() => {
      return () => {
        return () => cold('a', { a: undefined });
      };
    });

    service = new RequestService(
      objectCache,
      responseCache,
      uuidService,
      store
    );
    serviceAsAny = service as any;
  });

  describe('generateRequestId', () => {
    it('should generate a new request ID', () => {
      const result = service.generateRequestId();
      const expected = `client/${defaultUUID}`;

      expect(result).toBe(expected);
    });
  });

  describe('isPending', () => {
    describe('before the request is configured', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValue(observableOf(undefined));
      });

      it('should return false', () => {
        const result = service.isPending(testGetRequest);
        const expected = false;

        expect(result).toBe(expected);
      });
    });

    describe('when the request has been configured but hasn\'t reached the store yet', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValue(observableOf(undefined));
        serviceAsAny.requestsOnTheirWayToTheStore = [testHref];
      });

      it('should return true', () => {
        const result = service.isPending(testGetRequest);
        const expected = true;

        expect(result).toBe(expected);
      });
    });

    describe('when the request has reached the store, before the server responds', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValue(observableOf({
          completed: false
        }))
      });

      it('should return true', () => {
        const result = service.isPending(testGetRequest);
        const expected = true;

        expect(result).toBe(expected);
      });
    });

    describe('after the server responds', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValues(observableOf({
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
      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', {
              a: {
                completed: true
              }
            });
          };
        });
      });

      it('should return an Observable of the RequestEntry', () => {
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
      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', { a: undefined });
          };
        });
      });

      it('should return an Observable of undefined', () => {
        const result = service.getByUUID(testUUID);
        const expected = cold('b', {
          b: undefined
        });

        expect(result).toBeObservable(expected);
      });
    });

  });

  describe('getByHref', () => {
    describe('when the request with the specified href exists in the store', () => {
      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', { a: testUUID });
          };
        });
        spyOn(service, 'getByUUID').and.returnValue(cold('b', {
          b: {
            completed: true
          }
        }));
      });

      it('should return an Observable of the RequestEntry', () => {
        const result = service.getByHref(testHref);
        const expected = cold('c', {
          c: {
            completed: true
          }
        });

        expect(result).toBeObservable(expected);
      });
    });

    describe('when the request with the specified href doesn\'t exist in the store', () => {
      beforeEach(() => {
        selectSpy.and.callFake(() => {
          return () => {
            return () => hot('a', { a: undefined });
          };
        });
        spyOn(service, 'getByUUID').and.returnValue(cold('b', {
          b: undefined
        }));
      });

      it('should return an Observable of undefined', () => {
        const result = service.getByHref(testHref);
        const expected = cold('c', {
          c: undefined
        });

        expect(result).toBeObservable(expected);
      });
    });
  });

  describe('configure', () => {
    beforeEach(() => {
      spyOn(serviceAsAny, 'dispatchRequest');
    });

    describe('when the request is a GET request', () => {
      let request: RestRequest;

      beforeEach(() => {
        request = testGetRequest;
      });

      it('should track it on it\'s way to the store', () => {
        spyOn(serviceAsAny, 'trackRequestsOnTheirWayToTheStore');
        service.configure(request);
        expect(serviceAsAny.trackRequestsOnTheirWayToTheStore).toHaveBeenCalledWith(request);
      });
      describe('and it isn\'t cached or pending', () => {
        beforeEach(() => {
          spyOn(serviceAsAny, 'isCachedOrPending').and.returnValue(false);
        });

        it('should dispatch the request', () => {
          scheduler.schedule(() => service.configure(request));
          scheduler.flush();
          expect(serviceAsAny.dispatchRequest).toHaveBeenCalledWith(request);
        });
      });
      describe('and it is already cached or pending', () => {
        beforeEach(() => {
          spyOn(serviceAsAny, 'isCachedOrPending').and.returnValue(true);
        });

        it('shouldn\'t dispatch the request', () => {
          service.configure(request);
          expect(serviceAsAny.dispatchRequest).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the request isn\'t a GET request', () => {
      it('should dispatch the request', () => {
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

    describe('when forceBypassCache is true', () => {
      it('should call clearRequestsOnTheirWayToTheStore method', () => {
        spyOn(serviceAsAny, 'clearRequestsOnTheirWayToTheStore');
        service.configure(testPostRequest, true);
        expect(serviceAsAny.clearRequestsOnTheirWayToTheStore).toHaveBeenCalledWith(testPostRequest.href);
      });
    });

  });

  describe('isCachedOrPending', () => {
    describe('when the request is cached', () => {
      describe('in the ObjectCache', () => {
        beforeEach(() => {
          (objectCache.hasBySelfLink as any).and.returnValues(true);
        });

        it('should return true', () => {
          const result = serviceAsAny.isCachedOrPending(testGetRequest);
          const expected = true;

          expect(result).toEqual(expected);
        });
      });
      describe('in the responseCache', () => {
        beforeEach(() => {
          (responseCache.has as any).and.returnValues(true);
        });

        describe('and it\'s a DSOSuccessResponse', () => {
          beforeEach(() => {
            (responseCache.get as any).and.returnValues(observableOf({
                response: {
                  isSuccessful: true,
                  resourceSelfLinks: [
                    'https://rest.api/endpoint/selfLink1',
                    'https://rest.api/endpoint/selfLink2'
                  ]
                }
              }
            ));
          });

          it('should return true if all top level links in the response are cached in the object cache', () => {
            (objectCache.hasBySelfLink as any).and.returnValues(false, true, true);

            const result = serviceAsAny.isCachedOrPending(testGetRequest);
            const expected = true;

            expect(result).toEqual(expected);
          });
          it('should return false if not all top level links in the response are cached in the object cache', () => {
            (objectCache.hasBySelfLink as any).and.returnValues(false, true, false);

            const result = serviceAsAny.isCachedOrPending(testGetRequest);
            const expected = false;

            expect(result).toEqual(expected);
          });
        });
        describe('and it isn\'t a DSOSuccessResponse', () => {
          beforeEach(() => {
            (objectCache.hasBySelfLink as any).and.returnValues(false);
            (responseCache.has as any).and.returnValues(true);
            (responseCache.get as any).and.returnValues(observableOf({
                response: {
                  isSuccessful: true
                }
              }
            ));
          });

          it('should return true', () => {
            const result = serviceAsAny.isCachedOrPending(testGetRequest);
            const expected = true;

            expect(result).toEqual(expected);
          });
        });
      });
    });

    describe('when the request is pending', () => {
      beforeEach(() => {
        spyOn(service, 'isPending').and.returnValue(true);
      });

      it('should return true', () => {
        const result = serviceAsAny.isCachedOrPending(testGetRequest);
        const expected = true;

        expect(result).toEqual(expected);
      });
    });

    describe('when the request is neither cached nor pending', () => {
      it('should return false', () => {
        const result = serviceAsAny.isCachedOrPending(testGetRequest);
        const expected = false;

        expect(result).toEqual(expected);
      });
    });
  });

  describe('dispatchRequest', () => {
    beforeEach(() => {
      spyOn(store, 'dispatch');
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
        selectSpy.and.callFake(() => {
          return () => {
            return () => observableOf({ request });
          };
        });
        serviceAsAny.trackRequestsOnTheirWayToTheStore(request);
        expect(serviceAsAny.requestsOnTheirWayToTheStore.includes(request.href)).toBeFalsy();
      });
    });
  });

  describe('clearRequestsOnTheirWayToTheStore', () => {
    let request: GetRequest;

    beforeEach(() => {
      request = testPatchRequest;
    });

    describe('when there is no request entry', () => {
      it('should remove response from cache', () => {
        spyOn(service, 'getByHref').and.returnValue(observableOf(undefined));

        serviceAsAny.clearRequestsOnTheirWayToTheStore(request.href);

        expect(responseCache.remove).toHaveBeenCalledWith(request.href);
      });
    });

    describe('when there is a request entry and is not pending', () => {
      it('should remove response from cache and stop tracking the request', () => {
        spyOn(service, 'getByHref').and.returnValue(observableOf({responsePending: false}));

        serviceAsAny.clearRequestsOnTheirWayToTheStore(request.href);

        expect(responseCache.remove).toHaveBeenCalledWith(request.href);
        expect(serviceAsAny.requestsOnTheirWayToTheStore.includes(request.href)).toBeFalsy();

      });
    });

  });
});
