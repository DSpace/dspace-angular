import { HttpClient } from '@angular/common/http';

import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { cold, getTestScheduler } from 'jasmine-marbles';

import { RequestService } from '../../../data/request.service';
import { buildPaginatedList } from '../../../data/paginated-list.model';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { RestResponse } from '../../../cache/response.models';
import { PageInfo } from '../../../shared/page-info.model';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { QualityAssuranceEventRestService } from './quality-assurance-event-rest.service';
import {
  qualityAssuranceEventObjectMissingPid,
  qualityAssuranceEventObjectMissingPid2,
  qualityAssuranceEventObjectMissingProjectFound
} from '../../../../shared/mocks/notifications.mock';
import { ReplaceOperation } from 'fast-json-patch';
import {RequestEntry} from '../../../data/request-entry.model';
import {FindListOptions} from '../../../data/find-list-options.model';

describe('QualityAssuranceEventRestService', () => {
  let scheduler: TestScheduler;
  let service: QualityAssuranceEventRestService;
  let serviceASAny: any;
  let responseCacheEntry: RequestEntry;
  let responseCacheEntryB: RequestEntry;
  let responseCacheEntryC: RequestEntry;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let comparator: any;

  const endpointURL = 'https://rest.api/rest/api/integration/qatopics';
  const requestUUID = '8b3c913a-5a4b-438b-9181-be1a5b4a1c8a';
  const topic = 'ENRICH!MORE!PID';

  const pageInfo = new PageInfo();
  const array = [ qualityAssuranceEventObjectMissingPid, qualityAssuranceEventObjectMissingPid2 ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const qaEventObjectRD = createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingPid);
  const qaEventObjectMissingProjectRD = createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingProjectFound);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  const status = 'ACCEPTED';
  const operation: ReplaceOperation<string>[] = [
    {
      path: '/status',
      op: 'replace',
      value: status
    }
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
      getByUUID: jasmine.createSpy('getByUUID')
    });

    responseCacheEntryB = new RequestEntry();
    responseCacheEntryB.request = { href: 'https://rest.api/' } as any;
    responseCacheEntryB.response = new RestResponse(true, 201, 'Created');

    responseCacheEntryC = new RequestEntry();
    responseCacheEntryC.request = { href: 'https://rest.api/' } as any;
    responseCacheEntryC.response = new RestResponse(true, 204, 'No Content');

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('(a)', {
        a: qaEventObjectRD
      }),
      buildList: cold('(a)', {
        a: paginatedListRD
      }),
      buildFromRequestUUID: jasmine.createSpy('buildFromRequestUUID')
    });

    objectCache = {} as ObjectCacheService;
    halService = jasmine.createSpyObj('halService', {
       getEndpoint: cold('a|', { a: endpointURL })
    });

    notificationsService = {} as NotificationsService;
    http = {} as HttpClient;
    comparator = {} as any;

    service = new QualityAssuranceEventRestService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    serviceASAny = service;

    spyOn(serviceASAny.dataService, 'searchBy').and.callThrough();
    spyOn(serviceASAny.dataService, 'findById').and.callThrough();
    spyOn(serviceASAny.dataService, 'patch').and.callThrough();
    spyOn(serviceASAny.dataService, 'postOnRelated').and.callThrough();
    spyOn(serviceASAny.dataService, 'deleteOnRelated').and.callThrough();
  });

  describe('getEventsByTopic', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(qaEventObjectRD));
    });

    it('should proxy the call to dataservice.searchBy', () => {
      const options: FindListOptions = {
        searchParams: [
          {
            fieldName: 'topic',
            fieldValue: topic
          }
        ]
      };
      service.getEventsByTopic(topic);
      expect(serviceASAny.dataService.searchBy).toHaveBeenCalledWith('findByTopic', options, true, true);
    });

    it('should return a RemoteData<PaginatedList<QualityAssuranceEventObject>> for the object with the given Topic', () => {
      const result = service.getEventsByTopic(topic);
      const expected = cold('(a)', {
         a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getEvent', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(qaEventObjectRD));
    });

    it('should proxy the call to dataservice.findById', () => {
      service.getEvent(qualityAssuranceEventObjectMissingPid.id).subscribe(
        (res) => {
          expect(serviceASAny.dataService.findById).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingPid.id, true, true);
        }
      );
    });

    it('should return a RemoteData<QualityAssuranceEventObject> for the object with the given URL', () => {
      const result = service.getEvent(qualityAssuranceEventObjectMissingPid.id);
      const expected = cold('(a)', {
        a: qaEventObjectRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('patchEvent', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(qaEventObjectRD));
    });

    it('should proxy the call to dataservice.patch', () => {
      service.patchEvent(status, qualityAssuranceEventObjectMissingPid).subscribe(
        (res) => {
          expect(serviceASAny.dataService.patch).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingPid, operation);
        }
      );
    });

    it('should return a RemoteData with HTTP 200', () => {
      const result = service.patchEvent(status, qualityAssuranceEventObjectMissingPid);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingPid)
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('boundProject', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntryB));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntryB));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(qaEventObjectMissingProjectRD));
    });

    it('should proxy the call to dataservice.postOnRelated', () => {
      service.boundProject(qualityAssuranceEventObjectMissingProjectFound.id, requestUUID).subscribe(
        (res) => {
          expect(serviceASAny.dataService.postOnRelated).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingProjectFound.id, requestUUID);
        }
      );
    });

    it('should return a RestResponse with HTTP 201', () => {
      const result = service.boundProject(qualityAssuranceEventObjectMissingProjectFound.id, requestUUID);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject(qualityAssuranceEventObjectMissingProjectFound)
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('removeProject', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntryC));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntryC));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(createSuccessfulRemoteDataObject({})));
    });

    it('should proxy the call to dataservice.deleteOnRelated', () => {
      service.removeProject(qualityAssuranceEventObjectMissingProjectFound.id).subscribe(
        (res) => {
          expect(serviceASAny.dataService.deleteOnRelated).toHaveBeenCalledWith(qualityAssuranceEventObjectMissingProjectFound.id);
        }
      );
    });

    it('should return a RestResponse with HTTP 204', () => {
      const result = service.removeProject(qualityAssuranceEventObjectMissingProjectFound.id);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject({})
      });
      expect(result).toBeObservable(expected);
    });
  });

});
