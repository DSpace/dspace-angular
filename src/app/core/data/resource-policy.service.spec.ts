import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResourcePolicy } from '../shared/resource-policy.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindByIDRequest } from './request.models';
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
    id: 1
  } as ResourcePolicy;
  const requestURL = `https://rest.api/rest/api/resourcepolicies/${testObject.id}`;
  const requestID = 1;

  beforeEach(() => {
    scheduler = getTestScheduler();

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestID,
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
