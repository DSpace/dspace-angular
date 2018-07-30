import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from '../../../../node_modules/rxjs';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PIDService } from './pid.service';
import { FindByIDRequest } from './request.models';
import { RequestService } from './request.service';

describe('PIDService', () => {
  let scheduler: TestScheduler;
  let service: PIDService;
  let halService: HALEndpointService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  const testObject = {
    id: '9b4f22f4-164a-49db-8817-3316b6ee5746'
  } as DSpaceObject;
  const pidLink = 'https://rest.api/rest/api/pid/find{?id}';
  const requestURL = `https://rest.api/rest/api/pid/find?id=${testObject.id}`;
  const requestUUID = '34cfed7c-f597-49ef-9cbe-ea351f0023c2';

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: pidLink })
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

    service = new PIDService(
      requestService,
      rdbService,
      halService
    )
  });

  describe('findById', () => {
    it('should call HALEndpointService with the path to the pid endpoint', () => {
      scheduler.schedule(() => service.findById(testObject.id));
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith('pid');
    });

    it('should configure the proper FindByIDRequest', () => {
      scheduler.schedule(() => service.findById(testObject.id));
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(new FindByIDRequest(requestUUID, requestURL, testObject.id));
    });

    it('should return a RemoteData<DSpaceObject> for the object with the given ID', () => {
      const result = service.findById(testObject.id);
      const expected = cold('a', {
        a: {
          payload: testObject
        }
      });
      expect(result).toBeObservable(expected);
    });
  });
});
