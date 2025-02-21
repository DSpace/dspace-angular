import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '../../../../../modules/core/src/lib/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../../modules/core/src/lib/core/cache/object-cache.service';
import { RestResponse } from '../../../../../modules/core/src/lib/core/cache/response.models';
import { FindAllData } from '../../../../../modules/core/src/lib/core/data/base/find-all-data';
import { testFindAllDataImplementation } from '../../../../../modules/core/src/lib/core/data/base/find-all-data.spec';
import { RemoteData } from '../../../../../modules/core/src/lib/core/data/remote-data';
import { RequestService } from '../../../../../modules/core/src/lib/core/data/request.service';
import { RequestEntry } from '../../../../../modules/core/src/lib/core/data/request-entry.model';
import { RequestEntryState } from '../../../../../modules/core/src/lib/core/data/request-entry-state.model';
import { NotificationsService } from '../../../../../modules/core/src/lib/core/notifications/notifications.service';
import { HALEndpointService } from '../../../../../modules/core/src/lib/core/shared/hal-endpoint.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { LdnItemfiltersService } from './ldn-itemfilters-data.service';

describe('LdnItemfiltersService test', () => {
  let scheduler: TestScheduler;
  let service: LdnItemfiltersService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let responseCacheEntry: RequestEntry;

  const endpointURL = `https://rest.api/rest/api/ldn/itemfilters`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const remoteDataMocks = {
    Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
  };

  function initTestService() {
    return new LdnItemfiltersService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();

    objectCache = {} as ObjectCacheService;
    notificationsService = {} as NotificationsService;
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
    });


    service = initTestService();
  });

  describe('composition', () => {
    const initFindAllService = () => new LdnItemfiltersService(null, null, null, null, null) as unknown as FindAllData<any>;
    testFindAllDataImplementation(initFindAllService);
  });

  describe('get endpoint', () => {
    it('should retrieve correct endpoint', (done) => {
      service.getEndpoint().subscribe(() => {
        expect(halService.getEndpoint).toHaveBeenCalledWith('itemfilters');
        done();
      });
    });
  });

});
