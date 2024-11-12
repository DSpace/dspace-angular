import { HttpClient } from '@angular/common/http';

import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { cold, getTestScheduler } from 'jasmine-marbles';

import { RequestService } from '../../../data/request.service';
import { buildPaginatedList } from '../../../data/paginated-list.model';
import { RequestEntry } from '../../../data/request-entry.model';
import { FindListOptions } from '../../../data/find-list-options.model';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { RestResponse } from '../../../cache/response.models';
import { PageInfo } from '../../../shared/page-info.model';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { OpenaireBrokerEventRestService } from './openaire-broker-event-rest.service';
import {
  openaireBrokerEventObjectMissingPid,
  openaireBrokerEventObjectMissingPid2,
  openaireBrokerEventObjectMissingProjectFound
} from '../../../../shared/mocks/openaire.mock';
import { ReplaceOperation } from 'fast-json-patch';
import { RequestParam } from '../../../cache/models/request-param.model';

describe('OpenaireBrokerEventRestService', () => {
  let scheduler: TestScheduler;
  let service: OpenaireBrokerEventRestService;
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

  const endpointURL = 'https://rest.api/rest/api/integration/nbtopics';
  const requestUUID = '8b3c913a-5a4b-438b-9181-be1a5b4a1c8a';
  const topic = 'ENRICH!MORE!PID';

  const pageInfo = new PageInfo();
  const array = [ openaireBrokerEventObjectMissingPid, openaireBrokerEventObjectMissingPid2 ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const brokerEventObjectRD = createSuccessfulRemoteDataObject(openaireBrokerEventObjectMissingPid);
  const brokerEventObjectMissingProjectRD = createSuccessfulRemoteDataObject(openaireBrokerEventObjectMissingProjectFound);
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
        a: brokerEventObjectRD
      }),
      buildList: cold('(a)', {
        a: paginatedListRD
      }),
      buildFromRequestUUID: jasmine.createSpy('buildFromRequestUUID'),
      buildFromRequestUUIDAndAwait: jasmine.createSpy('buildFromRequestUUIDAndAwait')
    });

    objectCache = {} as ObjectCacheService;
    halService = jasmine.createSpyObj('halService', {
       getEndpoint: cold('a|', { a: endpointURL })
    });

    notificationsService = {} as NotificationsService;
    http = {} as HttpClient;
    comparator = {} as any;

    service = new OpenaireBrokerEventRestService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      comparator
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
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(brokerEventObjectRD));
    });

    it('should proxy the call to dataservice.searchBy', () => {
      const options: FindListOptions = {
        searchParams: [
          new RequestParam('topic', topic, false)
        ]
      };
      service.getEventsByTopic(topic);
      expect(serviceASAny.searchData.searchBy).toHaveBeenCalledWith('findByTopic', options, true, true);
    });

    it('should return a RemoteData<PaginatedList<OpenaireBrokerEventObject>> for the object with the given Topic', () => {
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
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(brokerEventObjectRD));
    });

    it('should call findById', () => {
      service.getEvent(openaireBrokerEventObjectMissingPid.id).subscribe(
        (res) => {
          expect(serviceASAny.findById).toHaveBeenCalledWith(openaireBrokerEventObjectMissingPid.id, true, true);
        }
      );
    });

    it('should return a RemoteData<OpenaireBrokerEventObject> for the object with the given URL', () => {
      const result = service.getEvent(openaireBrokerEventObjectMissingPid.id);
      const expected = cold('(a)', {
        a: brokerEventObjectRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('patchEvent', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(brokerEventObjectRD));
      serviceASAny.rdbService.buildFromRequestUUIDAndAwait.and.returnValue(observableOf(brokerEventObjectRD));
    });

    it('should proxy the call to dataservice.patch', () => {
      service.patchEvent(status, openaireBrokerEventObjectMissingPid).subscribe(
        (res) => {
          expect(serviceASAny.patchData.patch).toHaveBeenCalledWith(openaireBrokerEventObjectMissingPid, operation);
        }
      );
    });

    it('should return a RemoteData with HTTP 200', () => {
      const result = service.patchEvent(status, openaireBrokerEventObjectMissingPid);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject(openaireBrokerEventObjectMissingPid)
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('boundProject', () => {
    beforeEach(() => {
      serviceASAny.requestService.getByHref.and.returnValue(observableOf(responseCacheEntryB));
      serviceASAny.requestService.getByUUID.and.returnValue(observableOf(responseCacheEntryB));
      serviceASAny.rdbService.buildFromRequestUUID.and.returnValue(observableOf(brokerEventObjectMissingProjectRD));
    });

    it('should proxy the call to dataservice.postOnRelated', () => {
      service.boundProject(openaireBrokerEventObjectMissingProjectFound.id, requestUUID).subscribe(
        (res) => {
          expect(serviceASAny.postOnRelated).toHaveBeenCalledWith(openaireBrokerEventObjectMissingProjectFound.id, requestUUID);
        }
      );
    });

    it('should return a RestResponse with HTTP 201', () => {
      const result = service.boundProject(openaireBrokerEventObjectMissingProjectFound.id, requestUUID);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject(openaireBrokerEventObjectMissingProjectFound)
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
      service.removeProject(openaireBrokerEventObjectMissingProjectFound.id).subscribe(
        (res) => {
          expect(serviceASAny.deleteOnRelated).toHaveBeenCalledWith(openaireBrokerEventObjectMissingProjectFound.id);
        }
      );
    });

    it('should return a RestResponse with HTTP 204', () => {
      const result = service.removeProject(openaireBrokerEventObjectMissingProjectFound.id);
      const expected = cold('(a|)', {
        a: createSuccessfulRemoteDataObject({})
      });
      expect(result).toBeObservable(expected);
    });
  });

});
