import { CollectionDataService } from './collection-data.service';
import { RequestService } from './request.service';
import { TranslateService } from '@ngx-translate/core';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { getMockTranslateService } from '../../shared/mocks/mock-translate.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ContentSourceRequest, RequestError, UpdateContentSourceRequest } from './request.models';
import { ContentSource } from '../shared/content-source.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RequestEntry } from './request.reducer';
import { ErrorResponse, RestResponse } from '../cache/response.models';

const url = 'fake-url';
const collectionId = 'fake-collection-id';

describe('CollectionDataService', () => {
  let service: CollectionDataService;

  let requestService: RequestService;
  let translate: TranslateService;
  let notificationsService: any;
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
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(ContentSourceRequest), undefined);
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
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(UpdateContentSourceRequest), undefined);
      }));
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
        expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(UpdateContentSourceRequest), undefined);
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
    halService = new HALEndpointServiceStub(url);
    notificationsService = new NotificationsServiceStub();
    translate = getMockTranslateService();

    service = new CollectionDataService(requestService, null, null, null, null, null, halService, notificationsService, null, null, translate);
  }

});
