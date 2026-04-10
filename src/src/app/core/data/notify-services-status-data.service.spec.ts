import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotifyRequestsStatus } from '../../item-page/simple/notify-requests-status/notify-requests-status.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotifyRequestsStatusDataService } from './notify-services-status-data.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { RequestEntry } from './request-entry.model';
import { RequestEntryState } from './request-entry-state.model';

describe('NotifyRequestsStatusDataService test', () => {
  let scheduler: TestScheduler;
  let service: NotifyRequestsStatusDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const endpointURL = `https://rest.api/rest/api/suggestiontargets`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const remoteDataMocks = {
    Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
  };

  function initTestService() {
    return new NotifyRequestsStatusDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();

    objectCache = {} as ObjectCacheService;
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: of(endpointURL),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: createSuccessfulRemoteDataObject$({}, 500),
      buildList: cold('a', { a: remoteDataMocks.Success }),
      buildFromHref: createSuccessfulRemoteDataObject$({ test: 'test' }),
    });


    service = initTestService();
  });

  describe('getNotifyRequestsStatus', () => {
    it('should get notify status', (done) => {
      service.getNotifyRequestsStatus(requestUUID).subscribe((status) => {
        expect(halService.getEndpoint).toHaveBeenCalled();
        expect(requestService.generateRequestId).toHaveBeenCalled();
        expect(status).toEqual(createSuccessfulRemoteDataObject({ test: 'test' } as unknown as NotifyRequestsStatus));
        done();
      });
    });
  });
});
