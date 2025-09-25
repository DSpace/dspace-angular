import { HttpClient } from '@angular/common/http';
import { ReplaceOperation } from 'fast-json-patch';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import {
  qualityAssuranceEventObjectMissingPid,
  qualityAssuranceEventObjectMissingPid2,
  qualityAssuranceEventObjectMissingProjectFound,
} from '../../../../shared/mocks/notifications.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { ObjectCacheServiceStub } from '../../../../shared/testing/object-cache-service.stub';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { RequestParam } from '../../../cache/models/request-param.model';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { RestResponse } from '../../../cache/response.models';
import { FindListOptions } from '../../../data/find-list-options.model';
import { buildPaginatedList } from '../../../data/paginated-list.model';
import { RequestService } from '../../../data/request.service';
import { RequestEntry } from '../../../data/request-entry.model';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { PageInfo } from '../../../shared/page-info.model';
import { QualityAssuranceEventDataService } from './quality-assurance-event-data.service';

describe('QualityAssuranceEventDataService', () => {
  let scheduler: TestScheduler;
  let service: QualityAssuranceEventDataService;
  let serviceASAny: any;
  let responseCacheEntry: RequestEntry;
  let responseCacheEntryB: RequestEntry;
  let responseCacheEntryC: RequestEntry;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheServiceStub;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let comparator: any;

  const endpointURL = 'https://rest.api/rest/api/integration/qualityassurancetopics';
  const requestUUID = '8b3c913a-5a4b-438b-9181-be1a5b4a1c8a';
  const topic = 'ENRICH!MORE!PID';

  const pageInfo = new PageInfo();
  const array = [qualityAssuranceEventObjectMissingPid, qualityAssuranceEventObjectMissingPid2];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const qaEventObjectRD = createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingPid);
  const qaEventObjectMissingProjectRD = createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingProjectFound);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  const status = 'ACCEPTED';
  const operation: ReplaceOperation<string>[] = [
    {
      path: '/status',
      op: 'replace',
      value: status,
    },
  ];

  beforeEach(() => {
    scheduler = getTestScheduler();

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: jasmine.createSpy('getByHref'),
      getByUUID: jasmine.createSpy('getByUUID'),
    });

    responseCacheEntryB = new RequestEntry();
    responseCacheEntryB.request = { href: 'https://rest.api/' } as any;
    responseCacheEntryB.response = new RestResponse(true, 201, 'Created');

    responseCacheEntryC = new RequestEntry();
    responseCacheEntryC.request = { href: 'https://rest.api/' } as any;
    responseCacheEntryC.response = new RestResponse(true, 204, 'No Content');

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('(a)', {
        a: qaEventObjectRD,
      }),
      buildList: cold('(a)', {
        a: paginatedListRD,
      }),
      buildFromRequestUUID: jasmine.createSpy('buildFromRequestUUID'),
      buildFromRequestUUIDAndAwait: jasmine.createSpy('buildFromRequestUUIDAndAwait'),
    });

    objectCache = new ObjectCacheServiceStub();
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a|', { a: endpointURL }),
    });

    notificationsService = {} as NotificationsService;
    http = {} as HttpClient;
    comparator = {} as any;

    service = new QualityAssuranceEventDataService(
      requestService,
      rdbService,
      objectCache as ObjectCacheService,
      halService,
      notificationsService,
      comparator,
    );

    serviceASAny = service;

    spyOn(serviceASAny.searchData, 'searchBy').and.callThrough();
    spyOn(serviceASAny, 'findById').and.callThrough();
    spyOn(serviceASAny.patchData, 'patch').and.callThrough();
    spyOn(serviceASAny, 'postOnRelated').and.callThrough();
    spyOn(serviceASAny, 'deleteOnRelated').and.callThrough();
  });

  describe('getEventsByTopic', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(of(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(of(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(of(qaEventObjectRD));
    });

    it('should proxy the call to searchData.searchBy', () => {
      const options: FindListOptions = {
        searchParams: [
          new RequestParam('topic', topic),
        ],
      };
      service.getEventsByTopic(topic);
      expect(serviceASAny.searchData.searchBy).toHaveBeenCalledWith('findByTopic', options, true, true);
    });

    it('should return a RemoteData<PaginatedList<QualityAssuranceEventObject>> for the object with the given Topic', () => {
      const result = service.getEventsByTopic(topic);
      const expected = cold('(a)', {
        a: paginatedListRD,
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getEvent', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(of(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(of(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(of(qaEventObjectRD));
    });

    it('should call findById', () => {
      service.getEvent(qualityAssuranceEventObjectMissingPid.id).subscribe(
        (res) => {
          expect(serviceASAny.findById).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingPid.id, true, true);
        },
      );
    });

    it('should return a RemoteData for the object with the given URL', () => {
      const result = service.getEvent(qualityAssuranceEventObjectMissingPid.id);
      const expected = cold('(a)', {
        a: qaEventObjectRD,
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('patchEvent', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(of(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(of(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(of(qaEventObjectRD));
      serviceASAny.rdbService.buildFromRequestUUIDAndAwait.and.returnValue(of(qaEventObjectRD));
    });

    it('should proxy the call to patchData.patch', () => {
      service.patchEvent(status, qualityAssuranceEventObjectMissingPid).subscribe(
        (res) => {
          expect(serviceASAny.patchData.patch).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingPid, operation);
        },
      );
    });

    it('should return a RemoteData with HTTP 200', () => {
      const result = service.patchEvent(status, qualityAssuranceEventObjectMissingPid);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingPid),
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('boundProject', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(of(responseCacheEntryB));
      serviceASAny.requestService.getByUUID.and.returnValue(of(responseCacheEntryB));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(of(qaEventObjectMissingProjectRD));
    });

    it('should call postOnRelated', () => {
      service.boundProject(qualityAssuranceEventObjectMissingProjectFound.id, requestUUID).subscribe(
        (res) => {
          expect(serviceASAny.postOnRelated).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingProjectFound.id, requestUUID);
        },
      );
    });

    it('should return a RestResponse with HTTP 201', () => {
      const result = service.boundProject(qualityAssuranceEventObjectMissingProjectFound.id, requestUUID);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingProjectFound),
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('removeProject', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(of(responseCacheEntryC));
      serviceASAny.requestService.getByUUID.and.returnValue(of(responseCacheEntryC));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(of(createSuccessfulRemoteDataObject({})));
    });

    it('should call deleteOnRelated', () => {
      service.removeProject(qualityAssuranceEventObjectMissingProjectFound.id).subscribe(
        (res) => {
          expect(serviceASAny.deleteOnRelated).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingProjectFound.id);
        },
      );
    });

    it('should return a RestResponse with HTTP 204', () => {
      const result = service.removeProject(qualityAssuranceEventObjectMissingProjectFound.id);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject({}),
      });
      expect(result).toBeObservable(expected);
    });
  });

});
