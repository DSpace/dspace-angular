import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { PageInfo } from '../shared/page-info.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { HrefOnlyDataService } from '../data/href-only-data.service';
import { getMockHrefOnlyDataService } from '../../shared/mocks/href-only-data.service.mock';
import { WorkspaceitemDataService } from './workspaceitem-data.service';
import { Store } from '@ngrx/store';
import { RestResponse } from '../cache/response.models';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Item } from '../shared/item.model';
import { WorkspaceItem } from './models/workspaceitem.model';
import { RequestEntry } from '../data/request-entry.model';
import { CoreState } from '../core-state.model';
import { testSearchDataImplementation } from '../data/base/search-data.spec';
import { testDeleteDataImplementation } from '../data/base/delete-data.spec';
import { SearchData } from '../data/base/search-data';
import { DeleteData } from '../data/base/delete-data';
import { RequestParam } from '../cache/models/request-param.model';
import { PostRequest } from '../data/request.models';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';

describe('WorkspaceitemDataService test', () => {
  let scheduler: TestScheduler;
  let service: WorkspaceitemDataService;
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
          value: 'This is just another title'
        }
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article'
        }
      ],
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald'
        }
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26'
        }
      ]
    }
  });
  const itemRD = createSuccessfulRemoteDataObject(item);
  const wsi = Object.assign(new WorkspaceItem(), { item: observableOf(itemRD), id: '1234', uuid: '1234' });
  const wsiRD = createSuccessfulRemoteDataObject(wsi);

  const endpointURL = `https://rest.api/rest/api/submission/workspaceitems`;

  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  objectCache = {} as ObjectCacheService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparatorEntry = {} as any;
  const store = {} as Store<CoreState>;
  const pageInfo = new PageInfo();

  function initTestService() {
    hrefOnlyDataService = getMockHrefOnlyDataService();
    return new WorkspaceitemDataService(
      comparatorEntry,
      halService,
      http,
      notificationsService,
      requestService,
      rdbService,
      objectCache,
      store
    );
  }

  describe('composition', () => {
    const initSearchService = () => new WorkspaceitemDataService(null, null, null, null, null, null, null, null) as unknown as SearchData<any>;
    const initDeleteService = () => new WorkspaceitemDataService(null, null, null, null, null, null, null, null) as unknown as DeleteData<any>;

    testSearchDataImplementation(initSearchService);
    testDeleteDataImplementation(initDeleteService);
  });

  describe('', () => {
    beforeEach(() => {

      scheduler = getTestScheduler();

      halService = jasmine.createSpyObj('halService', {
        getEndpoint: observableOf(endpointURL)
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
          a: wsiRD
        }),
        buildFromRequestUUID: createSuccessfulRemoteDataObject$({})
      });

      service = initTestService();

      spyOn((service as any), 'findByHref').and.callThrough();
    });

    afterEach(() => {
      service = null;
    });

    describe('findByItem', () => {
      it('should proxy the call to UpdateDataServiceImpl.findByHref', () => {
        scheduler.schedule(() => service.findByItem('1234-1234', true, true, pageInfo));
        scheduler.flush();
        const searchUrl = service.getIDHref('item', [new RequestParam('uuid', encodeURIComponent('1234-1234'))]);
        expect((service as any).findByHref).toHaveBeenCalledWith(searchUrl, true, true);
      });

      it('should return a RemoteData<WorkspaceItem> for the search', () => {
        const result = service.findByItem('1234-1234', true, true, pageInfo);
        const expected = cold('a|', {
          a: wsiRD
        });
        expect(result).toBeObservable(expected);
      });

    });

    describe('importExternalSourceEntry', () => {
      it('should send a POST request containing the provided item request', (done) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;

        service.importExternalSourceEntry('externalHref', 'testId').subscribe(() => {
          expect(requestService.send).toHaveBeenCalledWith(new PostRequest(requestUUID, `${endpointURL}?owningCollection=testId`, 'externalHref', options));
          done();
        });
      });
    });
  });
});
