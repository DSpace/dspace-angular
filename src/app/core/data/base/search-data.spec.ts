/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { SearchData, SearchDataImpl } from './search-data';
import createSpyObj = jasmine.createSpyObj;
import { FindListOptions } from '../find-list-options.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { RequestService } from '../request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { Observable, of as observableOf } from 'rxjs';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/remote-data-build.service.mock';
import { TestScheduler } from 'rxjs/testing';
import { RemoteData } from '../remote-data';
import { RequestEntryState } from '../request-entry-state.model';

/**
 * Tests whether calls to `SearchData` methods are correctly patched through in a concrete data service that implements it
 */
export function testSearchDataImplementation(service: SearchData<any>, methods = ['searchBy', 'getSearchByHref']) {
  describe('SearchData implementation', () => {
    const OPTIONS = Object.assign(new FindListOptions(), { elementsPerPage: 10, currentPage: 3 });
    const FOLLOWLINKS = [
      followLink('test'),
      followLink('something'),
    ];

    beforeEach(() => {
      (service as any).searchData = createSpyObj('searchData', {
        searchBy: 'TEST searchBy',
        getSearchByHref: 'TEST getSearchByHref',
      });
    });

    if ('searchBy' in methods) {
      it('should handle calls to searchBy', () => {
        const out: any = service.searchBy('searchMethod', OPTIONS, false, true, ...FOLLOWLINKS);

        expect((service as any).searchData.searchBy).toHaveBeenCalledWith('searchMethod', OPTIONS, false, true, ...FOLLOWLINKS);
        expect(out).toBe('TEST searchBy');
      });
    }

    if ('getSearchByHref' in methods) {
      it('should handle calls to getSearchByHref', () => {
        const out: any = service.getSearchByHref('searchMethod', OPTIONS, ...FOLLOWLINKS);

        expect((service as any).searchData.getSearchByHref).toHaveBeenCalledWith('searchMethod', OPTIONS, ...FOLLOWLINKS);
        expect(out).toBe('TEST getSearchByHref');
      });
    }
  });
}

const endpoint = 'https://rest.api/core';

class TestService extends SearchDataImpl<any> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super(undefined, undefined, requestService, rdbService, objectCache, halService);
  }

  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return observableOf(endpoint);
  }
}

describe('SearchDataImpl', () => {
  let service: TestService;
  let requestService;
  let halService;
  let rdbService;
  let objectCache;
  let selfLink;
  let linksToFollow;
  let testScheduler;
  let remoteDataMocks;

  function initTestService(): TestService {
    requestService = getMockRequestService();
    halService = new HALEndpointServiceStub('url') as any;
    rdbService = getMockRemoteDataBuildService();
    objectCache = {

      addPatch: () => {
        /* empty */
      },
      getObjectBySelfLink: () => {
        /* empty */
      },
      getByHref: () => {
        /* empty */
      },
    } as any;
    selfLink = 'https://rest.api/endpoint/1698f1d3-be98-4c51-9fd8-6bfedcbd59b7';
    linksToFollow = [
      followLink('a'),
      followLink('b'),
    ];

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).toEqual(expected);
    });

    const timeStamp = new Date().getTime();
    const msToLive = 15 * 60 * 1000;
    const payload = { foo: 'bar' };
    const statusCodeSuccess = 200;
    const statusCodeError = 404;
    const errorMessage = 'not found';
    remoteDataMocks = {
      RequestPending: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
      ResponsePending: new RemoteData(undefined, msToLive, timeStamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
      Success: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.Success, undefined, payload, statusCodeSuccess),
      SuccessStale: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.SuccessStale, undefined, payload, statusCodeSuccess),
      Error: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.Error, errorMessage, undefined, statusCodeError),
      ErrorStale: new RemoteData(timeStamp, msToLive, timeStamp, RequestEntryState.ErrorStale, errorMessage, undefined, statusCodeError),
    };

    return new TestService(
      requestService,
      rdbService,
      objectCache,
      halService,
    );
  }

  beforeEach(() => {
    service = initTestService();
  });

  // todo: add specs (there were no search specs in original DataService suite!)
});
