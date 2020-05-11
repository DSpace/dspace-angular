import * as ngrx from '@ngrx/store';
import { ActionsSubject, Store } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { BehaviorSubject, EMPTY, of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { getMockObjectCacheService } from '../../shared/mocks/object-cache.service.mock';
import { defaultUUID, getMockUUIDService } from '../../shared/mocks/uuid.service.mock';
import { ObjectCacheService } from '../cache/object-cache.service';
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
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import { parseJsonSchemaToCommandDescription } from '@angular/cli/utilities/json-schema';

describe('RequestService', () => {
  let scheduler: TestScheduler;
  let service: RequestService;
  let serviceAsAny: any;
  let objectCache: ObjectCacheService;
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
      uuidService,
      store,
      undefined
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
        } as RequestEntry))
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
        } as RequestEntry));
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
        let callCounter = 0;
        const responses = [
          cold('a', { // A direct hit in the request cache
            a: {
              completed: true
            }
          }),
          cold('b', { b: undefined }), // No hit in the index
          cold('c', { c: undefined })  // So no mapped hit in the request cache
        ];
        selectSpy.and.callFake(() => {
          return () => {
            const response = responses[callCounter];
            callCounter++;
            return () => response;
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

    describe(`if the request with the specified UUID doesn't exist in the store `, () => {
      beforeEach(() => {
        let callCounter = 0;
        const responses = [
          cold('a', { a: undefined }), // No direct hit in the request cache
          cold('b', { b: undefined }), // No hit in the index
          cold('c', { c: undefined }), // So no mapped hit in the request cache
        ];
        selectSpy.and.callFake(() => {
          return () => {
            const response = responses[callCounter];
            callCounter++;
            return () => response;
          };
        });
      });

      it('should return an Observable of undefined', () => {
        const result = service.getByUUID(testUUID);

        scheduler.expectObservable(result).toBe('a', { a: undefined });
      });
    });

    describe(`if the request with the specified UUID wasn't sent, because it was already cached`, () => {
      beforeEach(() => {
        let callCounter = 0;
        const responses = [
          cold('a', { a: undefined }), // No direct hit in the request cache with that UUID
          cold('b', { b: 'otherRequestUUID' }), // A hit in the index, which returns the uuid of the cached request
          cold('c', {   // the call to retrieve the cached request using the UUID from the index
            c: {
              completed: true
            }
          })
        ];
        selectSpy.and.callFake(() => {
          return () => {
            const response = responses[callCounter];
            callCounter++;
            return () => response;
          };
        });
      });

      it(`it should return the cached request`, () => {
        const result = service.getByUUID(testUUID);

        scheduler.expectObservable(result).toBe('c', {
          c: {
            completed: true
          }
        });
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

  });

  describe('isCachedOrPending', () => {
    describe('when the request is cached', () => {
      describe('in the ObjectCache', () => {
        beforeEach(() => {
          (objectCache.hasBySelfLink as any).and.returnValue(true);
          (objectCache.hasByUUID as any).and.returnValue(true);
          spyOn(serviceAsAny, 'hasByHref').and.returnValue(false);
        });

        it('should return true for GetRequest', () => {
          const result = serviceAsAny.isCachedOrPending(testGetRequest);
          const expected = true;

          expect(result).toEqual(expected);
        });
      });
      describe('in the request cache', () => {
        beforeEach(() => {
          (objectCache.hasBySelfLink as any).and.returnValue(false);
          spyOn(serviceAsAny, 'hasByHref').and.returnValue(true);
        });
        it('should return true', () => {
          const result = serviceAsAny.isCachedOrPending(testGetRequest);
          const expected = true;

          expect(result).toEqual(expected);
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

  describe('isValid', () => {
    describe('when the given entry has no value', () => {
      let valid;
      beforeEach(() => {
        const entry = undefined;
        valid = serviceAsAny.isValid(entry);
      });
      it('return an observable emitting false', () => {
        expect(valid).toBe(false);
      })
    });

    describe('when the given entry has a value, but the request is not completed', () => {
      let valid;
      const requestEntry = { completed: false };
      beforeEach(() => {
        spyOn(service, 'getByUUID').and.returnValue(observableOf(requestEntry as RequestEntry));
        valid = serviceAsAny.isValid(requestEntry);
      });
      it('return an observable emitting false', () => {
        expect(valid).toBe(false);
      })
    });

    describe('when the given entry has a value, but the response is not successful', () => {
      let valid;
      const requestEntry = { completed: true, response: { isSuccessful: false } };
      beforeEach(() => {
        spyOn(service, 'getByUUID').and.returnValue(observableOf(requestEntry as RequestEntry));
        valid = serviceAsAny.isValid(requestEntry);
      });
      it('return an observable emitting false', () => {
        expect(valid).toBe(false);
      })
    });

    describe('when the given UUID has a value, its response was successful, but the response is outdated', () => {
      let valid;
      const now = 100000;
      const timeAdded = 99899;
      const msToLive = 100;
      const requestEntry = {
        completed: true,
        response: {
          isSuccessful: true,
          timeAdded: timeAdded
        },
        request: {
          responseMsToLive: msToLive,
        }
      };

      beforeEach(() => {
        spyOn(Date.prototype, 'getTime').and.returnValue(now);
        spyOn(service, 'getByUUID').and.returnValue(observableOf(requestEntry as RequestEntry));
        valid = serviceAsAny.isValid(requestEntry);
      });

      it('return an observable emitting false', () => {
        expect(valid).toBe(false);
      })
    });

    describe('when the given UUID has a value, a cached entry is found, its response was successful, and the response is not outdated', () => {
      let valid;
      const now = 100000;
      const timeAdded = 99999;
      const msToLive = 100;

      const requestEntry = {
        completed: true,
        response: {
          isSuccessful: true,
          timeAdded: timeAdded
        },
        request: {
          responseMsToLive: msToLive
        }
      };
      beforeEach(() => {
        spyOn(Date.prototype, 'getTime').and.returnValue(now);
        spyOn(service, 'getByUUID').and.returnValue(observableOf(requestEntry as RequestEntry));
        valid = serviceAsAny.isValid(requestEntry);
      });

      it('return an observable emitting true', () => {
        expect(valid).toBe(true);
      })
    })
  });

  describe('hasByHref', () => {
    describe('when nothing is returned by getByHref', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValue(EMPTY);
      });
      it('hasByHref should return false', () => {
        const result = service.hasByHref('');
        expect(result).toBe(false);
      });
    });

    describe('when isValid returns false', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValue(observableOf(undefined));
        spyOn(service as any, 'isValid').and.returnValue(false);
      });
      it('hasByHref should return false', () => {
        const result = service.hasByHref('');
        expect(result).toBe(false);
      });
    });

    describe('when isValid returns true', () => {
      beforeEach(() => {
        spyOn(service, 'getByHref').and.returnValue(observableOf(undefined));
        spyOn(service as any, 'isValid').and.returnValue(true);
      });
      it('hasByHref should return true', () => {
        const result = service.hasByHref('');
        expect(result).toBe(true);
      });
    });
  });
});
