import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindByIDRequest } from './request.models';
import { RequestService } from './request.service';
import { DSpaceObjectDataService } from './dspace-object-data.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
describe('DSpaceObjectDataService', () => {
  let scheduler: TestScheduler;
  let service: DSpaceObjectDataService;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  const testObject = {
    uuid: '9b4f22f4-164a-49db-8817-3316b6ee5746'
  } as DSpaceObject;
  const dsoLink = 'https://rest.api/rest/api/dso/find{?uuid}';
  const requestURL = `https://rest.api/rest/api/dso/find?uuid=${testObject.uuid}`;
  const requestUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: dsoLink })
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: cold('a', {
        a: {
          payload: testObject
        }
      })
    });
    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new DSpaceObjectDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    )
  });

  describe('findById', () => {
    it('should call HALEndpointService with the path to the dso endpoint', () => {
      scheduler.schedule(() => service.findById(testObject.uuid));
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('dso');
    });

    it('should configure the proper FindByIDRequest', () => {
      scheduler.schedule(() => service.findById(testObject.uuid));
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(new FindByIDRequest(requestUUID, requestURL, testObject.uuid));
    });

    it('should return a RemoteData<DSpaceObject> for the object with the given ID', () => {
      const result = service.findById(testObject.uuid);
      const expected = cold('a', {
        a: {
          payload: testObject
        }
      });
      expect(result).toBeObservable(expected);
    });
  });
});
