import { TestScheduler } from 'rxjs/testing';
import { RequestService } from '../../data/request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { RequestEntry } from '../../data/request-entry.model';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { RestResponse } from '../../cache/response.models';
import { of as observableOf } from 'rxjs';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core-state.model';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { DefaultChangeAnalyzer } from '../../data/default-change-analyzer.service';
import { testFindAllDataImplementation } from '../../data/base/find-all-data.spec';
import { FindAllData } from '../../data/base/find-all-data';
import { GetRequest } from '../../data/request.models';
import {
  createSuccessfulRemoteDataObject$
} from '../../../shared/remote-data.utils';
import { RemoteData } from '../../data/remote-data';
import { RequestEntryState } from '../../data/request-entry-state.model';
import { SuggestionSourceDataService } from './suggestion-source-data.service';
import { SuggestionSource } from '../models/suggestion-source.model';

describe('SuggestionSourceDataService test', () => {
  let scheduler: TestScheduler;
  let service: SuggestionSourceDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let http: HttpClient;
  let comparator: DefaultChangeAnalyzer<SuggestionSource>;
  let responseCacheEntry: RequestEntry;

  const store = {} as Store<CoreState>;
  const endpointURL = `https://rest.api/rest/api/suggestionsources`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const remoteDataMocks = {
    Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
  };

  function initTestService() {
    return new SuggestionSourceDataService(
      requestService,
      rdbService,
      store,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();

    objectCache = {} as ObjectCacheService;
    http = {} as HttpClient;
    notificationsService = {} as NotificationsService;
    comparator = {} as DefaultChangeAnalyzer<SuggestionSource>;
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: 'https://rest.api/' } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
      getByUUID: observableOf(responseCacheEntry),
    });

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: observableOf(endpointURL)
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: createSuccessfulRemoteDataObject$({}, 500),
      buildList: cold('a', { a: remoteDataMocks.Success })
    });


    service = initTestService();
  });

  describe('composition', () => {
    const initFindAllService = () => new SuggestionSourceDataService(null, null, null, null, null, null, null, null) as unknown as FindAllData<any>;
    testFindAllDataImplementation(initFindAllService);
  });

  describe('getSources', () => {
    it('should send a new GetRequest', () => {
      const expected = new GetRequest(requestService.generateRequestId(),  `${endpointURL}`);
      scheduler.schedule(() => service.getSources().subscribe());
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(expected, true);
    });
  });

  describe('getSource', () => {
    it('should send a new GetRequest', () => {
      const expected = new GetRequest(requestService.generateRequestId(),  `${endpointURL}/testId`);
      scheduler.schedule(() => service.getSource('testId').subscribe());
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(expected, true);
    });
  });
});
