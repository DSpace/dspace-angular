import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindByIDRequest, IdentifierType } from './request.models';
import { RequestService } from './request.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DsoRedirectDataService } from './dso-redirect-data.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';

describe('DsoRedirectDataService', () => {
  let scheduler: TestScheduler;
  let service: DsoRedirectDataService;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let router;
  let remoteData;
  const dsoUUID = '9b4f22f4-164a-49db-8817-3316b6ee5746';
  const dsoHandle = '1234567789/22';
  const encodedHandle = encodeURIComponent(dsoHandle);
  const pidLink = 'https://rest.api/rest/api/pid/find{?id}';
  const requestHandleURL = `https://rest.api/rest/api/pid/find?id=${encodedHandle}`;
  const requestUUIDURL = `https://rest.api/rest/api/pid/find?id=${dsoUUID}`;
  const requestUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';
  const store = {} as Store<CoreState>;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const objectCache = {} as ObjectCacheService;
  let setup;
  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', {a: pidLink})
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true
    });
    router = {
      navigate: jasmine.createSpy('navigate')
    };

    remoteData = {
      isSuccessful: true,
      error: undefined,
      hasSucceeded: true,
      isLoading: false,
      payload: {
        type: 'item',
        uuid: '123456789'
      }
    };

    setup = () => {
      rdbService = jasmine.createSpyObj('rdbService', {
        buildSingle: cold('a', {
          a: remoteData
        })
      });
      service = new DsoRedirectDataService(
        requestService,
        rdbService,
        store,
        objectCache,
        halService,
        notificationsService,
        http,
        comparator,
        router
      );
    }
  });

  describe('findById', () => {
    it('should call HALEndpointService with the path to the pid endpoint', () => {
      setup();
      scheduler.schedule(() => service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE));
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('pid');
    });

    it('should call HALEndpointService with the path to the dso endpoint', () => {
      setup();
      scheduler.schedule(() => service.findByIdAndIDType(dsoUUID, IdentifierType.UUID));
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('dso');
    });

    it('should call HALEndpointService with the path to the dso endpoint when identifier type not specified', () => {
      setup();
      scheduler.schedule(() => service.findByIdAndIDType(dsoUUID));
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('dso');
    });

    it('should configure the proper FindByIDRequest for uuid', () => {
      setup();
      scheduler.schedule(() => service.findByIdAndIDType(dsoUUID, IdentifierType.UUID));
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(new FindByIDRequest(requestUUID, requestUUIDURL, dsoUUID));
    });

    it('should configure the proper FindByIDRequest for handle', () => {
      setup();
      scheduler.schedule(() => service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE));
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(new FindByIDRequest(requestUUID, requestHandleURL, dsoHandle));
    });

    it('should navigate to item route', () => {
      remoteData.payload.type = 'item';
      setup();
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      // The framework would normally subscribe but do it here so we can test navigation.
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith([remoteData.payload.type + 's/' + remoteData.payload.uuid]);
    });

    it('should navigate to collections route', () => {
      remoteData.payload.type = 'collection';
      setup();
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith([remoteData.payload.type + 's/' + remoteData.payload.uuid]);
    });

    it('should navigate to communities route', () => {
      remoteData.payload.type = 'community';
      setup();
      const redir = service.findByIdAndIDType(dsoHandle, IdentifierType.HANDLE);
      redir.subscribe();
      scheduler.schedule(() => redir);
      scheduler.flush();
      expect(router.navigate).toHaveBeenCalledWith(['communities/' + remoteData.payload.uuid]);
    });
  })
});
