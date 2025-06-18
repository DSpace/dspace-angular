import { HttpClient } from '@angular/common/http';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { RequestParam } from '../../cache/models/request-param.model';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { RestResponse } from '../../cache/response.models';
import { RemoteData } from '../../data/remote-data';
import { RequestService } from '../../data/request.service';
import { RequestEntry } from '../../data/request-entry.model';
import { RequestEntryState } from '../../data/request-entry-state.model';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { SuggestionDataService } from './suggestion-data.service';

describe('SuggestionDataService test', () => {
  let scheduler: TestScheduler;
  let service: SuggestionDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let responseCacheEntry: RequestEntry;


  const testSource = 'test-source';
  const testUserId = '1234-4321';
  const endpointURL = `https://rest.api/rest/api/`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const remoteDataMocks = {
    Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
  };

  function initTestService() {
    return new SuggestionDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();

    objectCache = {} as ObjectCacheService;
    http = {} as HttpClient;
    notificationsService = {} as NotificationsService;
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
      setStaleByHrefSubstring: of(true),
    });

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: of(endpointURL),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: createSuccessfulRemoteDataObject$({}, 500),
      buildList: cold('a', { a: remoteDataMocks.Success }),
    });

    service = initTestService();
  });

  describe('Suggestion service', () => {
    it('should call suggestionsDataService.searchBy', () => {
      spyOn((service as any).searchData, 'searchBy').and.returnValue(of(null));
      const options = {
        searchParams: [new RequestParam('target', testUserId), new RequestParam('source', testSource)],
      };
      service.getSuggestionsByTargetAndSource(testUserId, testSource);
      expect((service as any).searchData.searchBy).toHaveBeenCalledWith('findByTargetAndSource', options, false, true);
    });

    it('should call suggestionsDataService.delete', () => {
      spyOn((service as any).deleteData, 'delete').and.returnValue(of(null));
      service.deleteSuggestion('1');
      expect((service as any).deleteData.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('Request service', () => {
    it('should call requestService.setStaleByHrefSubstring', () => {
      service.clearSuggestionRequests();
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalled();
    });
  });
});
