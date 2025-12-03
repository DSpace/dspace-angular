import { HttpClient } from '@angular/common/http';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { RestResponse } from '@dspace/core/cache/response.models';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { RequestService } from '@dspace/core/data/request.service';
import { RequestEntry } from '@dspace/core/data/request-entry.model';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationsService } from '../../../notification-system/notifications.service';
import {
  qualityAssuranceSourceObjectMoreAbstract,
  qualityAssuranceSourceObjectMorePid,
} from '../../../testing/notifications.mock';
import { ObjectCacheServiceStub } from '../../../testing/object-cache-service.stub';
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
