import {
  cold,
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { getMockHrefOnlyDataService } from '../../shared/mocks/href-only-data.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { Version } from '../shared/version.model';
import { VersionHistory } from '../shared/version-history.model';
import { testCreateDataImplementation } from './base/create-data.spec';
import { testDeleteDataImplementation } from './base/delete-data.spec';
import { testFindAllDataImplementation } from './base/find-all-data.spec';
import { testPatchDataImplementation } from './base/patch-data.spec';
import { testPutDataImplementation } from './base/put-data.spec';
import { testSearchDataImplementation } from './base/search-data.spec';
import { HrefOnlyDataService } from './href-only-data.service';
import { RequestService } from './request.service';
import { RequestEntry } from './request-entry.model';
import { UpdateDataServiceImpl } from './update-data.service';

describe('VersionDataService test', () => {
  let scheduler: TestScheduler;
  let service: UpdateDataServiceImpl<any>;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let hrefOnlyDataService: HrefOnlyDataService;
  let responseCacheEntry: RequestEntry;

  const notificationsService = {} as NotificationsService;

  const item = Object.assign(new Item(), {
    id: '1234-1234',
    uuid: '1234-1234',
    bundles: observableOf({}),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title',
        },
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article',
        },
      ],
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald',
        },
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26',
        },
      ],
    },
  });

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1',
    draftVersion: true,
  });

  const mockVersion: Version = Object.assign(new Version(), {
    item: createSuccessfulRemoteDataObject$(item),
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    version: 1,
  });
  const mockVersionRD = createSuccessfulRemoteDataObject(mockVersion);

  const endpointURL = `https://rest.api/rest/api/versioning/versions`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  objectCache = {} as ObjectCacheService;
  const comparatorEntry = {} as any;
  function initTestService() {
    hrefOnlyDataService = getMockHrefOnlyDataService();
    return new UpdateDataServiceImpl(
      'testLinkPath',
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      comparatorEntry,
      10 * 1000,
    );
  }

  beforeEach(() => {

    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL }),
    });
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
      getByUUID: observableOf(responseCacheEntry),
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('(a|)', {
        a: mockVersionRD,
      }),
    });

    service = initTestService();

    spyOn((service as any), 'findById').and.callThrough();
  });

  afterEach(() => {
    service = null;
  });

  describe('composition', () => {
    const initService = () => new UpdateDataServiceImpl(null, null, null, null, null, null, null, null);

    testPatchDataImplementation(initService);
    testSearchDataImplementation(initService);
    testDeleteDataImplementation(initService);
    testCreateDataImplementation(initService);
    testFindAllDataImplementation(initService);
    testPutDataImplementation(initService);
  });

});
