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
import {
  openaireSuggestionTargetReciterOne,
  openaireSuggestionTargetScopusOne,
  openaireSuggestionTargetScopusTwo,
} from '../../../../shared/mocks/openaire.mock';
import { RequestEntry } from '../../../data/request-entry.model';
import { QualityAssuranceSuggestionTargetDataService } from './quality-assurance-suggestion-target-data.service';
import { FindListOptions } from '../../../data/find-list-options.model';
import { RequestParam } from '../../../cache/models/request-param.model';

describe('QualityAssuranceSuggestionTargetDataService', () => {
  let scheduler: TestScheduler;
  let service: QualityAssuranceSuggestionTargetDataService;
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
  const array = [openaireSuggestionTargetScopusOne, openaireSuggestionTargetScopusTwo];
  const array2 = [openaireSuggestionTargetScopusTwo, openaireSuggestionTargetReciterOne];
  const paginatedListSource = buildPaginatedList(pageInfo, array);
  const paginatedListTarget = buildPaginatedList(pageInfo, array2);
  const qaTargetObjectRD = createSuccessfulRemoteDataObject(openaireSuggestionTargetScopusOne);
  const paginatedListSourceRD = createSuccessfulRemoteDataObject(paginatedListSource);
  const paginatedListTargetRD = createSuccessfulRemoteDataObject(paginatedListTarget);

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
        a: qaTargetObjectRD
      }),
      buildList: cold('(a)', {
        a: paginatedListSourceRD
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

    service = new QualityAssuranceSuggestionTargetDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService
    );

    spyOn((service as any).searchData, 'searchBy').and.callThrough();
    spyOn((service as any), 'findById').and.callThrough();
  });

  describe('getTargetById', () => {
    it('should call findById', () => {
      service.getTargetById(openaireSuggestionTargetScopusOne.id);
      expect((service as any).findById).toHaveBeenCalledWith(openaireSuggestionTargetScopusOne.id, true, true);
    });

    it('should return a RemoteData<OpenaireSuggestionTarget> for the object with the given URL', () => {
      const result = service.getTargetById(openaireSuggestionTargetScopusOne.id);
      const expected = cold('(a)', {
        a: qaTargetObjectRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getTargetsBySource', () => {
    beforeEach(() => {
      (service as any).requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      (service as any).requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      (service as any).rdbService.buildFromRequestUUID.and.returnValue(observableOf(qaTargetObjectRD));
      (service as any).rdbService.buildFromRequestUUIDAndAwait.and.returnValue(observableOf(qaTargetObjectRD));
    });

    it('should proxy the call to searchData.searchBy', () => {
      const options: FindListOptions = {
        searchParams: [
          new RequestParam('source', openaireSuggestionTargetScopusOne.source, false)
        ]
      };
      service.getTargetsBySource('scopus');
      expect((service as any).searchData.searchBy).toHaveBeenCalledWith('findBySource', options, true, true);
    });

    it('should return a RemoteData<PaginatedList<OpenaireSuggestionTarget>> for the object with the given Topic', () => {
      const result = service.getTargetsBySource('reciter');
      const expected = cold('(a)', {
        a: paginatedListSourceRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('getTargetsByUser', () => {
    beforeEach(() => {
      (service as any).requestService.getByHref.and.returnValue(observableOf(responseCacheEntry));
      (service as any).requestService.getByUUID.and.returnValue(observableOf(responseCacheEntry));
      (service as any).rdbService.buildFromRequestUUID.and.returnValue(observableOf(paginatedListSourceRD));
      (service as any).rdbService.buildFromRequestUUIDAndAwait.and.returnValue(observableOf(paginatedListSourceRD));
    });

    it('should proxy the call to searchData.searchBy', () => {
      const options: FindListOptions = {
        searchParams: [
          new RequestParam('target', 'gf3d657-9d6d-4a87-b905-fef0f8cae26', false)
        ]
      };
      service.getTargetsByUser('gf3d657-9d6d-4a87-b905-fef0f8cae26');
      expect((service as any).searchData.searchBy).toHaveBeenCalledWith('findByTarget', options, true, true);
    });

    it('should return a RemoteData<PaginatedList<OpenaireSuggestionTarget>> for the object with the given Topic', () => {
      const result = service.getTargetsByUser('gf3d657-9d6d-4a87-b905-fef0f8cae26');
      const expected = cold('(a)', {
        a: paginatedListSourceRD
      });
      expect(result).toBeObservable(expected);
    });
  });
});
