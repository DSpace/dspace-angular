import { HttpClient } from '@angular/common/http';

import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { cold, getTestScheduler } from 'jasmine-marbles';

import { RequestService } from '../../../data/request.service';
import { PaginatedList } from '../../../data/paginated-list';
import { RequestEntry } from '../../../data/request.reducer';
import { FindListOptions } from '../../../data/request.models';
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

describe('OpenaireBrokerEventRestService', () => {
  let scheduler: TestScheduler;
  let service: OpenaireBrokerEventRestService;
  let serviceB: OpenaireBrokerEventRestService;
  let serviceC: OpenaireBrokerEventRestService;
  let responseCacheEntry: RequestEntry;
  let responseCacheEntryB: RequestEntry;
  let responseCacheEntryC: RequestEntry;
  let requestService: RequestService;
  let requestServiceB: RequestService;
  let requestServiceC: RequestService;
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
  const paginatedList = new PaginatedList(pageInfo, array);
  const brokerEventObjectRD = createSuccessfulRemoteDataObject(openaireBrokerEventObjectMissingPid);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  const status = 'ACCEPTED';
  const operation: Array<ReplaceOperation<string>> = [
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
    responseCacheEntry.completed = true;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
      getByUUID: observableOf(responseCacheEntry),
    });

    responseCacheEntryB = new RequestEntry();
    responseCacheEntryB.request = { href: 'https://rest.api/' } as any;
    responseCacheEntryB.completed = true;
    responseCacheEntryB.response = new RestResponse(true, 201, 'Created');
    requestServiceB = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntryB),
      getByUUID: observableOf(responseCacheEntryB),
    });

    responseCacheEntryC = new RequestEntry();
    responseCacheEntryC.request = { href: 'https://rest.api/' } as any;
    responseCacheEntryC.completed = true;
    responseCacheEntryC.response = new RestResponse(true, 204, 'No Content');
    requestServiceC = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntryC),
      getByUUID: observableOf(responseCacheEntryC),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('(a)', {
        a: brokerEventObjectRD
      }),
      buildList: cold('(a)', {
        a: paginatedListRD
      }),
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
      http,
      comparator
    );

    serviceB = new OpenaireBrokerEventRestService(
      requestServiceB,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    serviceC = new OpenaireBrokerEventRestService(
      requestServiceC,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'searchBy').and.callThrough();
    spyOn((service as any).dataService, 'findById').and.callThrough();
    spyOn((service as any).dataService, 'patch').and.callThrough();
    spyOn((serviceB as any).dataService, 'postOnRelated').and.callThrough();
    spyOn((serviceC as any).dataService, 'deleteOnRelated').and.callThrough();
  });

  describe('getEventsByTopic', () => {
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
      expect((service as any).dataService.searchBy).toHaveBeenCalledWith('findByTopic', options);
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
    it('should proxy the call to dataservice.findById', () => {
      service.getEvent(openaireBrokerEventObjectMissingPid.id).subscribe(
        (res) => {
          expect((service as any).dataService.findById).toHaveBeenCalledWith(openaireBrokerEventObjectMissingPid.id);
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
    it('should proxy the call to dataservice.patch', () => {
      service.patchEvent(status, openaireBrokerEventObjectMissingPid).subscribe(
        (res) => {
          expect((service as any).dataService.patch).toHaveBeenCalledWith(openaireBrokerEventObjectMissingPid, operation);
        }
      );
    });

    it('should return a RestResponse with HTTP 200', () => {
      const result = service.patchEvent(status, openaireBrokerEventObjectMissingPid);
      const expected = cold('(a|)', {
        a: new RestResponse(true, 200, 'Success')
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('boundProject', () => {
    it('should proxy the call to dataservice.postOnRelated', () => {
      serviceB.boundProject(openaireBrokerEventObjectMissingProjectFound.id, requestUUID).subscribe(
        (res) => {
          expect((serviceB as any).dataService.postOnRelated).toHaveBeenCalledWith(openaireBrokerEventObjectMissingProjectFound.id, requestUUID);
        }
      );
    });

    it('should return a RestResponse with HTTP 201', () => {
      const result = serviceB.boundProject(openaireBrokerEventObjectMissingProjectFound.id, requestUUID);
      const expected = cold('(a|)', {
        a: new RestResponse(true, 201, 'Created')
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('removeProject', () => {
    it('should proxy the call to dataservice.deleteOnRelated', () => {
      serviceC.removeProject(openaireBrokerEventObjectMissingProjectFound.id).subscribe(
        (res) => {
          expect((serviceC as any).dataService.deleteOnRelated).toHaveBeenCalledWith(openaireBrokerEventObjectMissingProjectFound.id);
        }
      );
    });

    it('should return a RestResponse with HTTP 204', () => {
      const result = serviceC.removeProject(openaireBrokerEventObjectMissingProjectFound.id);
      const expected = cold('(a|)', {
        a: new RestResponse(true, 204, 'No Content')
      });
      expect(result).toBeObservable(expected);
    });
  });

});
