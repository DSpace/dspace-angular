import {
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { hasNoValue } from '@dspace/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '../cache';
import { ObjectCacheService } from '../cache';
import { getMockRequestService } from '../mocks';
import { getMockTranslateService } from '../mocks';
import { Collection } from '../shared';
import { ContentSource } from '../shared';
import { PageInfo } from '../shared';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../utilities';
import { HALEndpointServiceStub } from '../utilities';
import { NotificationsServiceStub } from '../utilities';
import { ObjectCacheServiceStub } from '../utilities';
import { testCreateDataImplementation } from './base';
import { testDeleteDataImplementation } from './base';
import { testFindAllDataImplementation } from './base';
import { testPatchDataImplementation } from './base';
import { testSearchDataImplementation } from './base';
import { CollectionDataService } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import {
  ContentSourceRequest,
  UpdateContentSourceRequest,
} from '@dspace/core';
import { RequestService } from '@dspace/core';

const url = 'fake-url';
const collectionId = 'fake-collection-id';

describe('CollectionDataService', () => {
  let service: CollectionDataService;
  let scheduler: TestScheduler;
  let requestService: RequestService;
  let translate: TranslateService;
  let notificationsService: any;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheServiceStub;
  let halService: any;

  const mockCollection1: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    name: 'test-collection-1',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-1-1',
      },
    },
  });

  const mockCollection2: Collection = Object.assign(new Collection(), {
    id: 'test-collection-2-2',
    name: 'test-collection-2',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-2-2',
      },
    },
  });

  const mockCollection3: Collection = Object.assign(new Collection(), {
    id: 'test-collection-3-3',
    name: 'test-collection-3',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-3-3',
      },
    },
  });

  const queryString = 'test-string';
  const communityId = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const pageInfo = new PageInfo();
  const array = [mockCollection1, mockCollection2, mockCollection3];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  describe('composition', () => {
    const initService = () => new CollectionDataService(null, null, null, null, null, null, null, null, null);

    testCreateDataImplementation(initService);
    testFindAllDataImplementation(initService);
    testSearchDataImplementation(initService);
    testPatchDataImplementation(initService);
    testDeleteDataImplementation(initService);
  });

  describe('when the requests are successful', () => {
    beforeEach(() => {
      createService();
    });

    describe('when calling getContentSource', () => {
      let contentSource$;

      beforeEach(() => {
        contentSource$ = service.getContentSource(collectionId);
      });

      it('should send a new ContentSourceRequest', fakeAsync(() => {
        contentSource$.subscribe();
        tick();
        expect(requestService.send).toHaveBeenCalledWith(jasmine.any(ContentSourceRequest), true);
      }));
    });

    describe('when calling updateContentSource', () => {
      let returnedContentSource$;
      let contentSource;

      beforeEach(() => {
        contentSource = new ContentSource();
        returnedContentSource$ = service.updateContentSource(collectionId, contentSource);
      });

      it('should send a new UpdateContentSourceRequest', fakeAsync(() => {
        returnedContentSource$.subscribe();
        tick();
        expect(requestService.send).toHaveBeenCalledWith(jasmine.any(UpdateContentSourceRequest));
      }));
    });

    describe('when calling getAuthorizedCollection', () => {
      beforeEach(() => {
        scheduler = getTestScheduler();
        spyOn(service, 'getAuthorizedCollection').and.callThrough();
        spyOn(service, 'getAuthorizedCollectionByCommunity').and.callThrough();
      });

      it('should proxy the call to getAuthorizedCollection', () => {
        scheduler.schedule(() => service.getAuthorizedCollection(queryString));
        scheduler.flush();

        expect(service.getAuthorizedCollection).toHaveBeenCalledWith(queryString);
      });

      it('should return a RemoteData<PaginatedList<Collection>> for the getAuthorizedCollection', () => {
        const result = service.getAuthorizedCollection(queryString);
        const expected = cold('a|', {
          a: paginatedListRD,
        });
        expect(result).toBeObservable(expected);
      });

      it('should proxy the call to getAuthorizedCollectionByCommunity', () => {
        scheduler.schedule(() => service.getAuthorizedCollectionByCommunity(communityId, queryString));
        scheduler.flush();

        expect(service.getAuthorizedCollectionByCommunity).toHaveBeenCalledWith(communityId, queryString);
      });

      it('should return a RemoteData<PaginatedList<Collection>> for the getAuthorizedCollectionByCommunity', () => {
        const result = service.getAuthorizedCollectionByCommunity(communityId, queryString);
        const expected = cold('a|', {
          a: paginatedListRD,
        });
        expect(result).toBeObservable(expected);
      });
    });
  });

  describe('when the requests are unsuccessful', () => {
    beforeEach(() => {
      createService(createFailedRemoteDataObject$('Error', 500));
    });

    describe('when calling updateContentSource', () => {
      let returnedContentSource$;
      let contentSource;

      beforeEach(() => {
        contentSource = new ContentSource();
        returnedContentSource$ = service.updateContentSource(collectionId, contentSource);
      });

      it('should send a new UpdateContentSourceRequest', fakeAsync(() => {
        returnedContentSource$.subscribe();
        tick();
        expect(requestService.send).toHaveBeenCalledWith(jasmine.any(UpdateContentSourceRequest));
      }));

      it('should display an error notification', fakeAsync(() => {
        returnedContentSource$.subscribe();
        tick();
        expect(notificationsService.error).toHaveBeenCalled();
      }));
    });
  });

  /**
   * Create a CollectionDataService used for testing
   * @param response$   Supply a RemoteData to be returned by the REST API (optional)
   */
  function createService(response$?: Observable<RemoteData<any>>) {
    requestService = getMockRequestService();
    let buildResponse$ = response$;
    if (hasNoValue(response$)) {
      buildResponse$ = createSuccessfulRemoteDataObject$({});
    }
    rdbService = jasmine.createSpyObj('rdbService', {
      buildList: hot('a|', {
        a: paginatedListRD,
      }),
      buildFromRequestUUID: buildResponse$,
      buildSingle: buildResponse$,
    });
    objectCache = new ObjectCacheServiceStub();
    halService = new HALEndpointServiceStub(url);
    notificationsService = new NotificationsServiceStub();
    translate = getMockTranslateService();

    service = new CollectionDataService(requestService, rdbService, objectCache as ObjectCacheService, halService, null, notificationsService, null, null, translate);
  }

});
