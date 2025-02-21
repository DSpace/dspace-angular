import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
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
import { CoreState } from '@dspace/core';
import { HrefOnlyDataService } from '../data';
import { RequestService } from '../data';
import { RequestEntry } from '../data';
import { getMockHrefOnlyDataService } from '../mocks';
import { NotificationsService } from '@dspace/core';
import { HALEndpointService } from '../shared';
import { Item } from '../shared';
import { PageInfo } from '../shared';
import { createSuccessfulRemoteDataObject } from '../utilities';
import { WorkflowItem } from './models';
import { WorkflowItemDataService } from '@dspace/core';

describe('WorkflowItemDataService test', () => {
  let scheduler: TestScheduler;
  let service: WorkflowItemDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let hrefOnlyDataService: HrefOnlyDataService;
  let responseCacheEntry: RequestEntry;

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
  const itemRD = createSuccessfulRemoteDataObject(item);
  const wsi = Object.assign(new WorkflowItem(), { item: observableOf(itemRD), id: '1234', uuid: '1234' });
  const wsiRD = createSuccessfulRemoteDataObject(wsi);

  const endpointURL = `https://rest.api/rest/api/submission/workspaceitems`;
  const searchRequestURL = `https://rest.api/rest/api/submission/workspaceitems/search/item?uuid=1234-1234`;
  const searchRequestURL$ = observableOf(searchRequestURL);

  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  objectCache = {} as ObjectCacheService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const comparatorEntry = {} as any;
  const store = {} as Store<CoreState>;
  const pageInfo = new PageInfo();

  function initTestService() {
    hrefOnlyDataService = getMockHrefOnlyDataService();
    return new WorkflowItemDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
    );
  }

  describe('', () => {
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
        buildSingle: hot('a|', {
          a: wsiRD,
        }),
      });

      service = initTestService();

      spyOn((service as any), 'findByHref').and.callThrough();
      spyOn((service as any).searchData, 'getSearchByHref').and.returnValue(searchRequestURL$);
    });

    afterEach(() => {
      service = null;
    });

    describe('findByItem', () => {
      it('should proxy the call to UpdateDataServiceImpl.findByHref', () => {
        scheduler.schedule(() => service.findByItem('1234-1234', true, true, pageInfo));
        scheduler.flush();

        expect((service as any).findByHref).toHaveBeenCalledWith(searchRequestURL$, true, true);
      });

      it('should return a RemoteData<WorkspaceItem> for the search', () => {
        const result = service.findByItem('1234-1234', true, true, pageInfo);
        const expected = cold('a|', {
          a: wsiRD,
        });
        expect(result).toBeObservable(expected);
      });

    });
  });

});
