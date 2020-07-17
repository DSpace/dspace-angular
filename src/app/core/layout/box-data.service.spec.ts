import { BoxDataService } from './box-data.service';
import { TestScheduler } from 'rxjs/testing';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestEntry } from '../data/request.reducer';
import { Box } from './models/box.model';
import { BOX } from './models/box.resource-type';
import { PageInfo } from '../shared/page-info.model';
import { PaginatedList } from '../data/paginated-list';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { getTestScheduler, cold, hot } from 'jasmine-marbles';
import { RestResponse } from '../cache/response.models';
import { of } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { FindListOptions } from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';

describe('BoxDataService', () => {
  let scheduler: TestScheduler;
  let service: BoxDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const boxMetadata: Box = {
    type: BOX,
    id: 1,
    uuid: 'shortname-box-1-1',
    shortname: 'shortname-box-1',
    header: 'header-box-1',
    entityType: 'Box',
    collapsed: false,
    minor: false,
    style: 'col-md-4',
    priority: 0,
    clear: false,
    security: 0,
    boxType: 'metadata',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/boxes/1'
      },
      configuration: {
        href: 'https://rest.api/rest/api/boxes/1/configuration'
      }
    }
  };

  const boxSearch: Box = {
    type: BOX,
    id: 2,
    uuid: 'shortname-box-2-2',
    shortname: 'shortname-box-2',
    header: 'header-box-2',
    entityType: 'Box',
    collapsed: false,
    minor: false,
    style: 'col-md-10',
    priority: 0,
    clear: false,
    security: 0,
    boxType: 'search',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/boxes/2'
      },
      configuration: {
        href: 'https://rest.api/rest/api/boxes/2/configuration'
      }
    }
  };

  const boxMetrics: Box = {
    type: BOX,
    id: 3,
    uuid: 'shortname-box-3-3',
    shortname: 'shortname-box-3',
    header: 'header-box-3',
    entityType: 'Box',
    collapsed: false,
    minor: false,
    style: 'col-md-2',
    priority: 0,
    clear: false,
    security: 0,
    boxType: 'metrics',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/boxes/3'
      },
      configuration: {
        href: 'https://rest.api/rest/api/boxes/3/configuration'
      }
    }
  };

  const endpointURL = `https://rest.api/rest/api/boxes`;
  const requestURL = `https://rest.api/rest/api/boxes/${boxMetadata.id}`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const itemUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const entityType = 'Person';
  const boxId = '1';
  const tabId = 1;

  const pageInfo = new PageInfo();
  const array = [boxMetadata, boxSearch, boxMetrics];
  const paginatedList = new PaginatedList(pageInfo, array);
  const boxRD = createSuccessfulRemoteDataObject(boxMetadata);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: boxRD
      }),
      buildList: hot('a|', {
        a: paginatedListRD
      }),
    });
    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new BoxDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'findById').and.callThrough();
    spyOn((service as any).dataService, 'searchBy').and.callThrough();
    spyOn((service as any).dataService, 'getSearchByHref').and.returnValue(of(requestURL));
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(boxId));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(boxId);
    });

    it('should return a RemoteData<Box> for the object with the given id', () => {
      const result = service.findById(boxId);
      const expected = cold('a|', {
        a: boxRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('searchByItem', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new RequestParam('uuid', itemUUID),
        new RequestParam('tab', tabId)
      ];
      scheduler.schedule(() => service.findByItem(itemUUID, tabId));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchFindByItem, options);
    });

    it('should return a RemoteData<PaginatedList<Box>> for the search', () => {
      const result = service.findByItem(itemUUID, tabId);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });

  });

  describe('searchByEntityType', () => {
    it('should proxy the call to dataservice.searchBy', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new RequestParam('type', entityType)
      ];
      scheduler.schedule(() => service.findByEntityType(entityType));
      scheduler.flush();

      expect((service as any).dataService.searchBy).toHaveBeenCalledWith((service as any).searchFindByEntityType, options);
    });

    it('should return a RemoteData<PaginatedList<Box>> for the search', () => {
      const result = service.findByEntityType(entityType);
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });

  });
});
