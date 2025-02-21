import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '@dspace/core';
import { ObjectCacheService } from '@dspace/core';
import { RestResponse } from '@dspace/core';
import { FindAllData } from '@dspace/core';
import { testFindAllDataImplementation } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { RequestEntry } from '@dspace/core';
import { RequestEntryState } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { HALEndpointService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
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
