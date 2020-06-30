import { CollectionDataService } from './collection-data.service';
import { RequestService } from './request.service';
import { TranslateService } from '@ngx-translate/core';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { fakeAsync, tick } from '@angular/core/testing';
import { ContentSourceRequest, GetRequest, RequestError, UpdateContentSourceRequest } from './request.models';
import { ContentSource } from '../shared/content-source.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RequestEntry } from './request.reducer';
import { ErrorResponse, RestResponse } from '../cache/response.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Collection } from '../shared/collection.model';
import { PageInfo } from '../shared/page-info.model';
import { PaginatedList } from './paginated-list';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { hot, getTestScheduler, cold } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

const url = 'fake-url';
const collectionId = 'fake-collection-id';

describe('CollectionDataService', () => {
  let service: CollectionDataService;
  let scheduler: TestScheduler;
  let requestService: RequestService;
  let translate: TranslateService;
  let notificationsService: any;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: any;

  const mockCollection1: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    name: 'test-collection-1',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-1-1'
      }
    }
  });

  const mockCollection2: Collection = Object.assign(new Collection(), {
    id: 'test-collection-2-2',
    name: 'test-collection-2',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-2-2'
      }
    }
  });

  const mockCollection3: Collection = Object.assign(new Collection(), {
    id: 'test-collection-3-3',
    name: 'test-collection-3',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-3-3'
      }
    }
  });

  const queryString = 'test-string';
  const communityId = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const pageInfo = new PageInfo();
  const array = [mockCollection1, mockCollection2, mockCollection3];
  const paginatedList = new PaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

  describe('when the requests are successful', () => {
    beforeEach(() => {
      createService(observableOf({
        request: {
          href: 'https://rest.api/request'
        },
        completed: true
      }));
    });

    describe('when calling getContentSource', () => {
      let contentSource$;

      beforeEach(() => {
        contentSource$ = service.getContentSource(collectionId);
      });

      it('should configure a new ContentSourceRequest', fakeAsync(() => {
        contentSource$.subscribe();
        tick();
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(ContentSourceRequest));
      }));
    });

    describe('when calling updateContentSource', () => {
      let returnedContentSource$;
      let contentSource;

      beforeEach(() => {
        contentSource = new ContentSource();
        returnedContentSource$ = service.updateContentSource(collectionId, contentSource);
      });

      it('should configure a new UpdateContentSourceRequest', fakeAsync(() => {
        returnedContentSource$.subscribe();
        tick();
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(UpdateContentSourceRequest));
      }));
    });

    describe('getMappedItems', () => {
      let result;

      beforeEach(() => {
        result = service.getMappedItems('collection-id');
      });

      it('should configure a GET request', () => {
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(GetRequest));
      });
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

      it('should return a RemoteData<PaginatedList<Colletion>> for the getAuthorizedCollection', () => {
        const result = service.getAuthorizedCollection(queryString);
        const expected = cold('a|', {
          a: paginatedListRD
        });
        expect(result).toBeObservable(expected);
      });

      it('should proxy the call to getAuthorizedCollectionByCommunity', () => {
        scheduler.schedule(() => service.getAuthorizedCollectionByCommunity(communityId, queryString));
        scheduler.flush();

        expect(service.getAuthorizedCollectionByCommunity).toHaveBeenCalledWith(communityId, queryString);
      });

      it('should return a RemoteData<PaginatedList<Colletion>> for the getAuthorizedCollectionByCommunity', () => {
        const result = service.getAuthorizedCollectionByCommunity(communityId, queryString);
        const expected = cold('a|', {
          a: paginatedListRD
        });
        expect(result).toBeObservable(expected);
      });
    });
  });

  describe('when the requests are unsuccessful', () => {
    beforeEach(() => {
      createService(observableOf(Object.assign(new RequestEntry(), {
        response: new ErrorResponse(Object.assign({
          statusCode: 422,
          statusText: 'Unprocessable Entity',
          message: 'Error message'
        }))
      })));
    });

    describe('when calling updateContentSource', () => {
      let returnedContentSource$;
      let contentSource;

      beforeEach(() => {
        contentSource = new ContentSource();
        returnedContentSource$ = service.updateContentSource(collectionId, contentSource);
      });

      it('should configure a new UpdateContentSourceRequest', fakeAsync(() => {
        returnedContentSource$.subscribe();
        tick();
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(UpdateContentSourceRequest));
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
   * @param requestEntry$   Supply a requestEntry to be returned by the REST API (optional)
   */
  function createService(requestEntry$?) {
    requestService = getMockRequestService(requestEntry$);
    rdbService = jasmine.createSpyObj('rdbService', {
      buildList: hot('a|', {
        a: paginatedListRD
      })
    });
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    halService = new HALEndpointServiceStub(url);
    notificationsService = new NotificationsServiceStub();
    translate = getMockTranslateService();

    service = new CollectionDataService(requestService, rdbService, null, null, objectCache, halService, notificationsService, null, null, translate);
  }

});
