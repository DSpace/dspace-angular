import {
  cold,
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '../cache';
import { ObjectCacheService } from '../cache';
import { RestResponse } from '../cache';
import { getMockHrefOnlyDataService } from '../mocks';
import { NotificationsService } from '@dspace/core';
import { HALEndpointService } from '../shared';
import { Item } from '../shared';
import { Version } from '../shared';
import { VersionHistory } from '../shared';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../utilities';
import { testCreateDataImplementation } from './base';
import { testDeleteDataImplementation } from './base';
import { testFindAllDataImplementation } from './base';
import { testPatchDataImplementation } from './base';
import { testPutDataImplementation } from './base';
import { testSearchDataImplementation } from './base';
import { HrefOnlyDataService } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { RequestEntry } from '@dspace/core';
import { UpdateDataServiceImpl } from '@dspace/core';

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
