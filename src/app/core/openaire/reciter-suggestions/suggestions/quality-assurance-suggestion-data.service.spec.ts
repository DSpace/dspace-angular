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
import { openaireSuggestion, } from '../../../../shared/mocks/openaire.mock';
import { RequestEntry } from '../../../data/request-entry.model';
import { QualityAssuranceSuggestionDataService } from './quality-assurance-suggestion-data.service';
import { FindListOptions } from '../../../data/find-list-options.model';
import { RequestParam } from '../../../cache/models/request-param.model';

describe('QualityAssuranceSuggestionDataService', () => {
  let scheduler: TestScheduler;
  let service: QualityAssuranceSuggestionDataService;
  let responseCacheEntry: RequestEntry;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let comparator: any;

  const endpointURL = 'https://rest.api/rest/api/integration/suggestiontargets';
  const requestUUID = '8b3c913a-5a4b-438b-9181-be1a5b4a1c8a';

  const pageInfo = new PageInfo();
  const array = [openaireSuggestion];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const qaSuggestionObjectRD = createSuccessfulRemoteDataObject(openaireSuggestion);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const target = 'gf3d657-9d6d-4a87-b905-fef0f8cae26:24694772';
  const source = 'reciter';

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
        a: qaSuggestionObjectRD
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

    service = new QualityAssuranceSuggestionDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService
    );

    spyOn((service as any).searchData, 'searchBy').and.callThrough();
    spyOn((service as any).deleteData, 'delete');
    spyOn((service as any), 'findById').and.callThrough();
  });

  describe('deleteSuggestion', () => {
    it('should call delete', () => {
      service.deleteSuggestion(openaireSuggestion.id);
      expect((service as any).deleteData.delete).toHaveBeenCalledWith(openaireSuggestion.id);
    });
  });

  describe('getSuggestion', () => {
    it('should call findById', () => {
      service.getSuggestion(openaireSuggestion.id);
      expect((service as any).findById).toHaveBeenCalledWith(openaireSuggestion.id, true, true);
    });

    it('should return a RemoteData<OpenaireSuggestionTarget> for the object with the given URL', () => {
      const result = service.getSuggestion(openaireSuggestion.id);
      const expected = cold('(a)', {
        a: qaSuggestionObjectRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getSuggestionsByTargetAndSource', () => {
    beforeEach(() => {
      (service as any).requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      (service as any).requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      (service as any).rdbService.buildFromRequestUUID.and.returnValue(observableOf(qaSuggestionObjectRD));
      (service as any).rdbService.buildFromRequestUUIDAndAwait.and.returnValue(observableOf(qaSuggestionObjectRD));
    });

    it('should proxy the call to searchData.searchBy', () => {
      const options: FindListOptions = {
        searchParams: [
          new RequestParam('target', target, false),
          new RequestParam('source', source, false)
        ]
      };

      service.getSuggestionsByTargetAndSource(target, source);
      expect((service as any).searchData.searchBy).toHaveBeenCalledWith('findByTargetAndSource', options, true, true);
    });

    it('should return a RemoteData<PaginatedList<OpenaireSuggestionTarget>> for the object with the given Topic', () => {
      const result = service.getSuggestionsByTargetAndSource(target, source);
      const expected = cold('(a)', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });
  });

});
