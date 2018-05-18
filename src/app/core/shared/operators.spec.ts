import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { TestScheduler } from '../../../../node_modules/rxjs';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { getMockResponseCacheService } from '../../shared/mocks/mock-response-cache.service';
import { ResponseCacheEntry } from '../cache/response-cache.reducer';
import { ResponseCacheService } from '../cache/response-cache.service';
import { GetRequest, RestRequest } from '../data/request.models';
import { RequestEntry } from '../data/request.reducer';
import { RequestService } from '../data/request.service';
import {
  configureRequest,
  filterSuccessfulResponses, getRemoteDataPayload,
  getRequestFromSelflink, getResourceLinksFromResponse,
  getResponseFromSelflink
} from './operators';

describe('Core Module - RxJS Operators', () => {
  let scheduler: TestScheduler;
  let requestService: RequestService;
  const testSelfLink = 'https://rest.api/';

  const testRCEs = {
    a: { response: { isSuccessful: true, resourceSelfLinks: ['a', 'b', 'c', 'd'] } },
    b: { response: { isSuccessful: false, resourceSelfLinks: ['e', 'f'] } },
    c: { response: { isSuccessful: undefined, resourceSelfLinks: ['g', 'h', 'i'] } },
    d: { response: { isSuccessful: true, resourceSelfLinks: ['j', 'k', 'l', 'm', 'n'] } },
    e: { response: { isSuccessful: 1, resourceSelfLinks: [] } }
  };

  beforeEach(() => {
    scheduler = getTestScheduler();
  });

  describe('getRequestFromSelflink', () => {

    it('should return the RequestEntry corresponding to the self link in the source', () => {
      requestService = getMockRequestService();

      const source = hot('a', { a: testSelfLink });
      const result = source.pipe(getRequestFromSelflink(requestService));
      const expected = cold('a', { a: new RequestEntry()});

      expect(result).toBeObservable(expected)
    });

    it('should use the requestService to fetch the request by its self link', () => {
      requestService = getMockRequestService();

      const source = hot('a', { a: testSelfLink });
      scheduler.schedule(() => source.pipe(getRequestFromSelflink(requestService)).subscribe());
      scheduler.flush();

      expect(requestService.getByHref).toHaveBeenCalledWith(testSelfLink)
    });

    it('shouldn\'t return anything if there is no request matching the self link', () => {
      requestService = getMockRequestService(cold('a', { a: undefined }));

      const source = hot('a', { a: testSelfLink });
      const result = source.pipe(getRequestFromSelflink(requestService));
      const expected = cold('-');

      expect(result).toBeObservable(expected)
    });
  });

  describe('getResponseFromSelflink', () => {
    let responseCacheService: ResponseCacheService;

    beforeEach(() => {
      scheduler = getTestScheduler();
    });

    it('should return the ResponseCacheEntry corresponding to the self link in the source', () => {
      responseCacheService = getMockResponseCacheService();

      const source = hot('a', { a: testSelfLink });
      const result = source.pipe(getResponseFromSelflink(responseCacheService));
      const expected = cold('a', { a: new ResponseCacheEntry()});

      expect(result).toBeObservable(expected)
    });

    it('should use the responseCacheService to fetch the response by the request\'s link', () => {
      responseCacheService = getMockResponseCacheService();

      const source = hot('a', { a: testSelfLink });
      scheduler.schedule(() => source.pipe(getResponseFromSelflink(responseCacheService)).subscribe());
      scheduler.flush();

      expect(responseCacheService.get).toHaveBeenCalledWith(testSelfLink)
    });

    it('shouldn\'t return anything if there is no response matching the request\'s link', () => {
      responseCacheService = getMockResponseCacheService(undefined, cold('a', { a: undefined }));

      const source = hot('a', { a: testSelfLink });
      const result = source.pipe(getResponseFromSelflink(responseCacheService));
      const expected = cold('-');

      expect(result).toBeObservable(expected)
    });
  });

  describe('filterSuccessfulResponses', () => {
    it('should only return responses for which isSuccessful === true', () => {
      const source = hot('abcde', testRCEs);
      const result = source.pipe(filterSuccessfulResponses());
      const expected = cold('a--d-', testRCEs);

      expect(result).toBeObservable(expected)
    });
  });

  describe('getResourceLinksFromResponse', () => {
    it('should return the resourceSelfLinks for all successful responses', () => {
      const source = hot('abcde', testRCEs);
      const result = source.pipe(getResourceLinksFromResponse());
      const expected = cold('a--d-', {
        a: testRCEs.a.response.resourceSelfLinks,
        d: testRCEs.d.response.resourceSelfLinks
      });

      expect(result).toBeObservable(expected)
    });
  });

  describe('configureRequest', () => {
    it('should call requestService.configure with the source request', () => {
      requestService = getMockRequestService();
      const testRequest = new GetRequest('6b789e31-f026-4ff8-8993-4eb3b730c841', testSelfLink);
      const source = hot('a', { a: testRequest });
      scheduler.schedule(() => source.pipe(configureRequest(requestService)).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(testRequest)
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

      expect(result).toBeObservable(expected)
    });
  });
});
