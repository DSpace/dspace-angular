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
import { QualityAssuranceTopicRestService } from './quality-assurance-topic-rest.service';
import {
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid
} from '../../../../shared/mocks/notifications.mock';
import {RequestEntry} from '../../../data/request-entry.model';

describe('QualityAssuranceTopicRestService', () => {
  let scheduler: TestScheduler;
  let service: QualityAssuranceTopicRestService;
  let responseCacheEntry: RequestEntry;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let comparator: any;

  const endpointURL = 'https://rest.api/rest/api/integration/qualityassurancetopics';
  const requestUUID = '8b3c913a-5a4b-438b-9181-be1a5b4a1c8a';

  const pageInfo = new PageInfo();
  const array = [ qualityAssuranceTopicObjectMorePid, qualityAssuranceTopicObjectMoreAbstract ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const qaTopicObjectRD = createSuccessfulRemoteDataObject(qualityAssuranceTopicObjectMorePid);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  beforeEach(() => {
    scheduler = getTestScheduler();

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
      getByUUID: observableOf(responseCacheEntry),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('(a)', {
        a: qaTopicObjectRD
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

    service = new QualityAssuranceTopicRestService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'findAllByHref').and.callThrough();
    spyOn((service as any).dataService, 'findByHref').and.callThrough();
  });

  describe('getTopics', () => {
    it('should proxy the call to dataservice.findAllByHref', (done) => {
      service.getTopics().subscribe(
        (res) => {
          expect((service as any).dataService.findAllByHref).toHaveBeenCalledWith(endpointURL, {}, true, true);
        }
      );
      done();
    });

    it('should return a RemoteData<PaginatedList<QualityAssuranceTopicObject>> for the object with the given URL', () => {
      const result = service.getTopics();
      const expected = cold('(a)', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getTopic', () => {
    it('should proxy the call to dataservice.findByHref', (done) => {
      service.getTopic(qualityAssuranceTopicObjectMorePid.id).subscribe(
        (res) => {
          expect((service as any).dataService.findByHref).toHaveBeenCalledWith(endpointURL + '/' + qualityAssuranceTopicObjectMorePid.id, true, true);
        }
      );
      done();
    });

    it('should return a RemoteData<QualityAssuranceTopicObject> for the object with the given URL', () => {
      const result = service.getTopic(qualityAssuranceTopicObjectMorePid.id);
      const expected = cold('(a)', {
        a: qaTopicObjectRD
      });
      expect(result).toBeObservable(expected);
    });
  });

});
