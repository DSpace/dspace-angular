import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { GetRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import {
  configureRequest,
  getAllSucceededRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
  getRequestFromRequestHref,
  getRequestFromRequestUUID,
  getResponseFromEntry,
  redirectOn4xx
} from './operators';
import { of as observableOf } from 'rxjs';
import { createFailedRemoteDataObject, createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';

describe('Core Module - RxJS Operators', () => {
  let scheduler: TestScheduler;
  let requestService: RequestService;
  const testRequestHref = 'https://rest.api/';
  const testRequestUUID = 'https://rest.api/';

  const testRCEs = {
    a: { response: { isSuccessful: true, resourceSelfLinks: ['a', 'b', 'c', 'd'] } },
    b: { response: { isSuccessful: false, resourceSelfLinks: ['e', 'f'] } },
    c: { response: { isSuccessful: undefined, resourceSelfLinks: ['g', 'h', 'i'] } },
    d: { response: { isSuccessful: true, resourceSelfLinks: ['j', 'k', 'l', 'm', 'n'] } },
    e: { response: { isSuccessful: 1, resourceSelfLinks: [] } },
    f: { response: undefined },
    g: undefined
  };

  const testResponses = {
    a: testRCEs.a.response,
    b: testRCEs.b.response,
    c: testRCEs.c.response,
    d: testRCEs.d.response,
    e: testRCEs.e.response
  };

  beforeEach(() => {
    scheduler = getTestScheduler();
  });

  describe('getRequestFromRequestHref', () => {

    it('should return the RequestEntry corresponding to the self link in the source', () => {
      requestService = getMockRequestService();

      const source = hot('a', { a: testRequestHref });
      const result = source.pipe(getRequestFromRequestHref(requestService));
      const expected = cold('a', { a: new RequestEntry() });

      expect(result).toBeObservable(expected);
    });

    it('should use the requestService to fetch the request by its self link', () => {
      requestService = getMockRequestService();

      const source = hot('a', { a: testRequestHref });
      scheduler.schedule(() => source.pipe(getRequestFromRequestHref(requestService)).subscribe());
      scheduler.flush();

      expect(requestService.getByHref).toHaveBeenCalledWith(testRequestHref);
    });

    it('shouldn\'t return anything if there is no request matching the self link', () => {
      requestService = getMockRequestService(cold('a', { a: undefined }));

      const source = hot('a', { a: testRequestUUID });
      const result = source.pipe(getRequestFromRequestHref(requestService));
      const expected = cold('-');

      expect(result).toBeObservable(expected);
    });
  });

  describe('getRequestFromRequestUUID', () => {

    it('should return the RequestEntry corresponding to the request uuid in the source', () => {
      requestService = getMockRequestService();

      const source = hot('a', { a: testRequestUUID });
      const result = source.pipe(getRequestFromRequestUUID(requestService));
      const expected = cold('a', { a: new RequestEntry() });

      expect(result).toBeObservable(expected);
    });

    it('should use the requestService to fetch the request by its request uuid', () => {
      requestService = getMockRequestService();

      const source = hot('a', { a: testRequestUUID });
      scheduler.schedule(() => source.pipe(getRequestFromRequestUUID(requestService)).subscribe());
      scheduler.flush();

      expect(requestService.getByUUID).toHaveBeenCalledWith(testRequestUUID);
    });

    it('shouldn\'t return anything if there is no request matching the request uuid', () => {
      requestService = getMockRequestService(cold('a', { a: undefined }));

      const source = hot('a', { a: testRequestUUID });
      const result = source.pipe(getRequestFromRequestUUID(requestService));
      const expected = cold('-');

      expect(result).toBeObservable(expected);
    });
  });

  describe('configureRequest', () => {
    it('should call requestService.configure with the source request', () => {
      requestService = getMockRequestService();
      const testRequest = new GetRequest('6b789e31-f026-4ff8-8993-4eb3b730c841', testRequestHref);
      const source = hot('a', { a: testRequest });
      scheduler.schedule(() => source.pipe(configureRequest(requestService)).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(testRequest);
    });
  });

  describe('getRemoteDataPayload', () => {
    it('should return the payload of the source RemoteData', () => {
      const testRD = { a: { payload: 'a' } };
      const source = hot('a', testRD);
      const result = source.pipe(getRemoteDataPayload());
      const expected = cold('a', {
        a: testRD.a.payload,
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getResponseFromEntry', () => {
    it('should return the response for all not empty request entries, when they have a value', () => {
      const source = hot('abcdefg', testRCEs);
      const result = source.pipe(getResponseFromEntry());
      const expected = cold('abcde--', {
        a: testRCEs.a.response,
        b: testRCEs.b.response,
        c: testRCEs.c.response,
        d: testRCEs.d.response,
        e: testRCEs.e.response
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getFirstSucceededRemoteData', () => {
    it('should return the first() hasSucceeded RemoteData Observable', () => {
      const testRD = {
        a: createFailedRemoteDataObject(),
        b: createFailedRemoteDataObject(),
        c: createSuccessfulRemoteDataObject('c'),
        d: createSuccessfulRemoteDataObject('d'),
      };
      const source = hot('abcd', testRD);
      const result = source.pipe(getFirstSucceededRemoteData());
      const expected = cold('--(c|)', testRD);

      expect(result).toBeObservable(expected);

    });
  });

  describe('redirectOn4xx', () => {
    let router;
    let authService;

    beforeEach(() => {
      router = jasmine.createSpyObj('router', ['navigateByUrl']);
      authService = jasmine.createSpyObj('authService', {
        isAuthenticated: observableOf(true),
        setRedirectUrl: {}
      });
    });

    it('should call navigateByUrl to a 404 page, when the remote data contains a 404 error', () => {
      const testRD = createFailedRemoteDataObject('Object was not found', 404);

      observableOf(testRD).pipe(redirectOn4xx(router, authService)).subscribe();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/404', { skipLocationChange: true });
    });

    it('should call navigateByUrl to a 401 page, when the remote data contains a 403 error', () => {
      const testRD = createFailedRemoteDataObject('Forbidden', 403);

      observableOf(testRD).pipe(redirectOn4xx(router, authService)).subscribe();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/403', { skipLocationChange: true });
    });

    it('should not call navigateByUrl to a 404, 403 or 401 page, when the remote data contains another error than a 404, 403 or 401', () => {
      const testRD = createFailedRemoteDataObject('Something went wrong', 500);

      observableOf(testRD).pipe(redirectOn4xx(router, authService)).subscribe();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should not call navigateByUrl to a 404, 403 or 401 page, when the remote data contains no error', () => {
      const testRD = createSuccessfulRemoteDataObject(undefined);

      observableOf(testRD).pipe(redirectOn4xx(router, authService)).subscribe();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    describe('when the user is not authenticated', () => {
      beforeEach(() => {
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(false));
      });

      it('should set the redirect url and navigate to login when the remote data contains a 401 error', () => {
        const testRD = createFailedRemoteDataObject('The current user is unauthorized', 401);

        observableOf(testRD).pipe(redirectOn4xx(router, authService)).subscribe();
        expect(authService.setRedirectUrl).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith('login');
      });

      it('should set the redirect url and navigate to login when the remote data contains a 403 error', () => {
        const testRD = createFailedRemoteDataObject('Forbidden', 403);

        observableOf(testRD).pipe(redirectOn4xx(router, authService)).subscribe();
        expect(authService.setRedirectUrl).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith('login');
      });
    });
  });

  describe('getResponseFromEntry', () => {
    it('should return the response for all not empty request entries, when they have a value', () => {
      const source = hot('abcdefg', testRCEs);
      const result = source.pipe(getResponseFromEntry());
      const expected = cold('abcde--', {
        a: testRCEs.a.response,
        b: testRCEs.b.response,
        c: testRCEs.c.response,
        d: testRCEs.d.response,
        e: testRCEs.e.response
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getAllSucceededRemoteData', () => {
    it('should return all hasSucceeded RemoteData Observables', () => {
      const testRD = {
        a: createFailedRemoteDataObject(),
        b: createFailedRemoteDataObject(),
        c: createSuccessfulRemoteDataObject('c'),
        d: createSuccessfulRemoteDataObject('d'),
      };
      const source = hot('abcd', testRD);
      const result = source.pipe(getAllSucceededRemoteData());
      const expected = cold('--cd', testRD);

      expect(result).toBeObservable(expected);

    });

  });
});
