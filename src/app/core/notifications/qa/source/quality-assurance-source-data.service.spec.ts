import { HttpClient } from '@angular/common/http';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import {
  qualityAssuranceSourceObjectMoreAbstract,
  qualityAssuranceSourceObjectMorePid,
} from '../../../../shared/mocks/notifications.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../../shared/remote-data.utils';
import { ObjectCacheServiceStub } from '../../../../shared/testing/object-cache-service.stub';
import { RemoteDataBuildService } from '../../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../cache/object-cache.service';
import { RestResponse } from '../../../cache/response.models';
import { buildPaginatedList } from '../../../data/paginated-list.model';
import { RequestService } from '../../../data/request.service';
import { RequestEntry } from '../../../data/request-entry.model';
import { HALEndpointService } from '../../../shared/hal-endpoint.service';
import { PageInfo } from '../../../shared/page-info.model';
import { QualityAssuranceSourceDataService } from './quality-assurance-source-data.service';

describe('QualityAssuranceSourceDataService', () => {
  let scheduler: TestScheduler;
  let service: QualityAssuranceSourceDataService;
  let responseCacheEntry: RequestEntry;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheServiceStub;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let comparator: any;

  const endpointURL = 'https://rest.api/rest/api/integration/qualityassurancesources';
  const requestUUID = '8b3c913a-5a4b-438b-9181-be1a5b4a1c8a';

  const pageInfo = new PageInfo();
  const array = [qualityAssuranceSourceObjectMorePid, qualityAssuranceSourceObjectMoreAbstract];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const qaSourceObjectRD = createSuccessfulRemoteDataObject(qualityAssuranceSourceObjectMorePid);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  beforeEach(() => {
    scheduler = getTestScheduler();

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('(a)', {
        a: qaSourceObjectRD,
      }),
      buildList: cold('(a)', {
        a: paginatedListRD,
      }),
    });

    objectCache = new ObjectCacheServiceStub();
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a|', { a: endpointURL }),
    });

    notificationsService = {} as NotificationsService;
    http = {} as HttpClient;
    comparator = {} as any;

    service = new QualityAssuranceSourceDataService(
      requestService,
      rdbService,
      objectCache as ObjectCacheService,
      halService,
      notificationsService,
    );

    spyOn((service as any).findAllData, 'findAll').and.callThrough();
    spyOn((service as any), 'findById').and.callThrough();
  });

  describe('getSources', () => {
    it('should call findAll', (done) => {
      service.getSources().subscribe(
        (res) => {
          expect((service as any).findAllData.findAll).toHaveBeenCalledWith({}, true, true);
        },
      );
      done();
    });

    it('should return a RemoteData<PaginatedList<QualityAssuranceSourceObject>> for the object with the given URL', () => {
      const result = service.getSources();
      const expected = cold('(a)', {
        a: paginatedListRD,
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getSource', () => {
    it('should call findById', (done) => {
      service.getSource(qualityAssuranceSourceObjectMorePid.id).subscribe(
        (res) => {
          expect((service as any).findById).toHaveBeenCalledWith(qualityAssuranceSourceObjectMorePid.id, true, true);
        },
      );
      done();
    });

    it('should return a RemoteData<QualityAssuranceSourceObject> for the object with the given URL', () => {
      const result = service.getSource(qualityAssuranceSourceObjectMorePid.id);
      const expected = cold('(a)', {
        a: qaSourceObjectRD,
      });
      expect(result).toBeObservable(expected);
    });
  });

});
