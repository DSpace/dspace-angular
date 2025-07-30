import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { CreateData } from '../data/base/create-data';
import { testCreateDataImplementation } from '../data/base/create-data.spec';
import { DeleteData } from '../data/base/delete-data';
import { testDeleteDataImplementation } from '../data/base/delete-data.spec';
import { FindAllData } from '../data/base/find-all-data';
import { testFindAllDataImplementation } from '../data/base/find-all-data.spec';
import { PatchData } from '../data/base/patch-data';
import { testPatchDataImplementation } from '../data/base/patch-data.spec';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { RequestEntry } from '../data/request-entry.model';
import { RequestEntryState } from '../data/request-entry-state.model';
import { NotificationsService } from '../notification-system/notifications.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';
import { CoarNotifyConfigDataService } from './coar-notify-config-data.service';

describe('CoarNotifyConfigDataService test', () => {
  let scheduler: TestScheduler;
  let service: CoarNotifyConfigDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let responseCacheEntry: RequestEntry;

  const endpointURL = `https://rest.api/rest/api/coar-notify`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const remoteDataMocks = {
    Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
  };

  function initTestService() {
    return new CoarNotifyConfigDataService(
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
    const initCreateService = () => new CoarNotifyConfigDataService(null, null, null, null, null) as unknown as CreateData<any>;
    const initFindAllService = () => new CoarNotifyConfigDataService(null, null, null, null, null) as unknown as FindAllData<any>;
    const initDeleteService = () => new CoarNotifyConfigDataService(null, null, null, null, null) as unknown as DeleteData<any>;
    const initPatchService = () => new CoarNotifyConfigDataService(null, null, null, null, null) as unknown as PatchData<any>;
    testCreateDataImplementation(initCreateService);
    testFindAllDataImplementation(initFindAllService);
    testPatchDataImplementation(initPatchService);
    testDeleteDataImplementation(initDeleteService);
  });

});
