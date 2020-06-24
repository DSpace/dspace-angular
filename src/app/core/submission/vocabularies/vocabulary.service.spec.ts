import { HttpClient } from '@angular/common/http';

import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../cache/object-cache.service';
import { HALEndpointService } from '../../shared/hal-endpoint.service';
import { RequestService } from '../../data/request.service';
import { FindListOptions, VocabularyEntriesRequest } from '../../data/request.models';
import { RequestParam } from '../../cache/models/request-param.model';
import { PageInfo } from '../../shared/page-info.model';
import { PaginatedList } from '../../data/paginated-list';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { RequestEntry } from '../../data/request.reducer';
import { RestResponse } from '../../cache/response.models';
import { VocabularyService } from './vocabulary.service';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/remote-data-build.service.mock';
import { VocabularyFindOptions } from './models/vocabulary-find-options.model';

describe('VocabularyService', () => {
  let scheduler: TestScheduler;
  let service: VocabularyService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const vocabulary: any = {
    id: 'types',
    name: 'types',
    scrollable: true,
    hierarchical: false,
    preloadLevel: 1,
    type: 'vocabulary',
    uuid: 'vocabulary-types',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/submission/vocabularies/types'
      },
      entries: {
        href: 'https://rest.api/rest/api/submission/vocabularies/types/entries'
      },
    }
  };

  const anotherVocabulary: any = {
    id: 'srsc',
    name: 'srsc',
    scrollable: false,
    hierarchical: true,
    preloadLevel: 2,
    type: 'vocabulary',
    uuid: 'vocabulary-srsc',
    _links: {
      self: {
        href: 'https://rest.api/rest/api/submission/vocabularies/types'
      },
      entries: {
        href: 'https://rest.api/rest/api/submission/vocabularies/types/entries'
      },
    }
  };

  const vocabularyEntry: any = {
    display: 'testValue1',
    value: 'testValue1',
    otherInformation: {},
    type: 'vocabularyEntry'
  };

  const vocabularyEntryWithAuthority: any = {
    authority: 'authorityId1',
    display: 'testValue1',
    value: 'testValue1',
    otherInformation: {
      id: 'VR131402',
      parent: 'Research Subject Categories::SOCIAL SCIENCES::Social sciences::Social work',
      hasChildren: 'false',
      note: 'Familjeforskning'
    },
    type: 'vocabularyEntry',
    _links: {
      vocabularyEntryDetail: {
        href: 'https://rest.api/rest/api/submission/vocabularyEntryDetails/srsc:VR131402'
      }
    }
  };
  const endpointURL = `https://rest.api/rest/api/submission/vocabularies`;
  const requestURL = `https://rest.api/rest/api/submission/vocabularies/${vocabulary.id}`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const vocabularyId = 'types';
  const metadata = 'dc.type';
  const collectionUUID = '8b39g7ya-5a4b-438b-851f-be1d5b4a1c5a';
  const vocabularyOptions = new VocabularyFindOptions(collectionUUID, vocabularyId, metadata);
  const searchRequestURL = `https://rest.api/rest/api/submission/vocabularies/search/byMetadataAndCollection?metadata=${metadata}&collection=${collectionUUID}`;
  const entriesRequestURL = `https://rest.api/rest/api/submission/vocabularies/${vocabulary.id}/entries?metadata=${metadata}&collection=${collectionUUID}`;

  const pageInfo = new PageInfo();
  const array = [vocabulary, anotherVocabulary];
  const paginatedList = new PaginatedList(pageInfo, array);
  const vocabularyRD = createSuccessfulRemoteDataObject(vocabulary);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const getRequestEntry$ = (successful: boolean) => {
    return observableOf({
      response: { isSuccessful: successful, payload: vocabulary } as any
    } as RequestEntry)
  };
  objectCache = {} as ObjectCacheService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;

  function initTestService() {
    return new VocabularyService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: observableOf(responseCacheEntry),
      getByUUID: observableOf(responseCacheEntry),
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: vocabularyRD
      }),
      buildList: hot('a|', {
        a: paginatedListRD
      }),
    });

    service = initTestService();

    spyOn((service as any).dataService, 'findById').and.callThrough();
    spyOn((service as any).dataService, 'findAll').and.callThrough();
    spyOn((service as any).dataService, 'findByHref').and.callThrough();
    spyOn((service as any).dataService, 'searchBy').and.callThrough();
    spyOn((service as any).dataService, 'getSearchByHref').and.returnValue(observableOf(searchRequestURL));
    spyOn((service as any).dataService, 'getFindAllHref').and.returnValue(observableOf(entriesRequestURL));
  });

  afterEach(() => {
    service = null;
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(vocabularyId));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(vocabularyId);
    });

    it('should return a RemoteData<Vocabulary> for the object with the given id', () => {
      const result = service.findById(vocabularyId);
      const expected = cold('a|', {
        a: vocabularyRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('findByHref', () => {
    it('should proxy the call to dataservice.findByHref', () => {
      scheduler.schedule(() => service.findByHref(requestURL));
      scheduler.flush();

      expect((service as any).dataService.findByHref).toHaveBeenCalledWith(requestURL);
    });

    it('should return a RemoteData<Vocabulary> for the object with the given URL', () => {
      const result = service.findByHref(requestURL);
      const expected = cold('a|', {
        a: vocabularyRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('findAll', () => {
    it('should proxy the call to dataservice.findAll', () => {
      scheduler.schedule(() => service.findAll());
      scheduler.flush();

      expect((service as any).dataService.findAll).toHaveBeenCalled();
    });

    it('should return a RemoteData<PaginatedList<Vocabulary>>', () => {
      const result = service.findAll();
      const expected = cold('a|', {
        a: paginatedListRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('searchByMetadataAndCollection', () => {
    it('should proxy the call to dataservice.findByHref', () => {
      const options = new FindListOptions();
      options.searchParams = [
        new RequestParam('metadata', metadata),
        new RequestParam('collection', collectionUUID)
      ];
      scheduler.schedule(() => service.searchByMetadataAndCollection(vocabularyOptions).subscribe());
      scheduler.flush();

      expect((service as any).dataService.findByHref).toHaveBeenCalledWith(searchRequestURL);
    });

    it('should return a RemoteData<Vocabulary> for the search', () => {
      const result = service.searchByMetadataAndCollection(vocabularyOptions);
      const expected = cold('a|', {
        a: vocabularyRD
      });
      expect(result).toBeObservable(expected);
    });

  });

  describe('getVocabularyEntries', () => {

    beforeEach(() => {
      requestService = getMockRequestService(getRequestEntry$(true));
      rdbService = getMockRemoteDataBuildService();
      spyOn(rdbService, 'toRemoteDataObservable').and.callThrough();
      service = initTestService();
    });

    it('should configure a new VocabularyEntriesRequest', () => {
      const expected = new VocabularyEntriesRequest(requestService.generateRequestId(), entriesRequestURL);

      scheduler.schedule(() => service.getVocabularyEntries(vocabularyOptions).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should call RemoteDataBuildService to create the RemoteData Observable', () => {
      service.getVocabularyEntries(vocabularyOptions);

      expect(rdbService.toRemoteDataObservable).toHaveBeenCalled();

    });

  });

});
