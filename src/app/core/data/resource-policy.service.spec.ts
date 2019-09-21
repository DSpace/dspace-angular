import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResourcePolicy } from '../shared/resource-policy.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { GetRequest } from './request.models';
import { RequestService } from './request.service';
import { ResourcePolicyService } from './resource-policy.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';

describe('ResourcePolicyService', () => {
  let scheduler: TestScheduler;
  let service: ResourcePolicyService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  const testObject = {
    uuid: '664184ee-b254-45e8-970d-220e5ccc060b'
  } as ResourcePolicy;
  const requestURL = `https://rest.api/rest/api/resourcepolicies/${testObject.uuid}`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  beforeEach(() => {
    scheduler = getTestScheduler();

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
    const halService = {} as HALEndpointService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;
    const dataBuildService = {} as NormalizedObjectBuildService;

    service = new ResourcePolicyService(
      requestService,
      rdbService,
      dataBuildService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    )
  });

  describe('findByHref', () => {
    it('should configure the proper GetRequest', () => {
      scheduler.schedule(() => service.findByHref(requestURL));
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(new GetRequest(requestUUID, requestURL, null), false);
    });

    it('should return a RemoteData<ResourcePolicy> for the object with the given URL', () => {
      const result = service.findByHref(requestURL);
      const expected = cold('a', {
        a: {
          payload: testObject
        }
      });
      expect(result).toBeObservable(expected);
    });
  });
});
