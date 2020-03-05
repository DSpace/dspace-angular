import { CollectionDataService } from './collection-data.service';
import { RequestService } from './request.service';
import { TranslateService } from '@ngx-translate/core';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { getMockTranslateService } from '../../shared/mocks/mock-translate.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ContentSourceRequest, GetRequest, RequestError, UpdateContentSourceRequest } from './request.models';
import { ContentSource } from '../shared/content-source.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RequestEntry } from './request.reducer';
import { ErrorResponse, RestResponse } from '../cache/response.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

const url = 'fake-url';
const collectionId = 'fake-collection-id';

describe('CollectionDataService', () => {
  let service: CollectionDataService;

  let requestService: RequestService;
  let translate: TranslateService;
  let notificationsService: any;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: any;

  describe('when the requests are successful', () => {
    beforeEach(() => {
      createService();
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
      buildList: jasmine.createSpy('buildList')
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
