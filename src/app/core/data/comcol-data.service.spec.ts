import { Store } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable, TestScheduler } from 'rxjs/Rx';
import { GlobalConfig } from '../../../config';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { FindByIDRequest } from './request.models';
import { RequestService } from './request.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Community } from '../shared/community.model';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';

const LINK_NAME = 'test';

/* tslint:disable:max-classes-per-file */
class NormalizedTestObject extends NormalizedObject {
}

class TestService extends ComColDataService<NormalizedTestObject, any> {

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected EnvConfig: GlobalConfig,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected authService: AuthService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected linkPath: string
  ) {
    super();
  }
}
/* tslint:enable:max-classes-per-file */

describe('ComColDataService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let responseCache: ResponseCacheService;
  let requestService: RequestService;
  let cds: CommunityDataService;
  let objectCache: ObjectCacheService;
  let authService: AuthService;
  let halService: any = {};

  const rdbService = {} as RemoteDataBuildService;
  const store = {} as Store<CoreState>;
  const EnvConfig = {} as GlobalConfig;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;

  const scopeID = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const communitiesEndpoint = 'https://rest.api/core/communities';
  const communityEndpoint = `${communitiesEndpoint}/${scopeID}`;
  const scopedEndpoint = `${communityEndpoint}/${LINK_NAME}`;
  const serviceEndpoint = `https://rest.api/core/${LINK_NAME}`;
  const authHeader = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJlaWQiOiJhNjA4NmIzNC0zOTE4LTQ1YjctOGRkZC05MzI5YTcwMmEyNmEiLCJzZyI6W10sImV4cCI6MTUzNDk0MDcyNX0.RV5GAtiX6cpwBN77P_v16iG9ipeyiO7faNYSNMzq_sQ';

  const mockHalService = {
    getEndpoint: (linkPath) => Observable.of(communitiesEndpoint)
  };

  function initMockCommunityDataService(): CommunityDataService {
    return jasmine.createSpyObj('responseCache', {
      getEndpoint: hot('--a-', { a: communitiesEndpoint }),
      getFindByIDHref: cold('b-', { b: communityEndpoint })
    });
  }

  function initMockResponseCacheService(isSuccessful: boolean): ResponseCacheService {
    return jasmine.createSpyObj('responseCache', {
      get: cold('c-', {
        c: { response: { isSuccessful } }
      })
    });
  }

  function initMockObjectCacheService(): ObjectCacheService {
    return jasmine.createSpyObj('objectCache', {
      getByUUID: cold('d-', {
        d: {
          _links: {
            [LINK_NAME]: scopedEndpoint
          }
        }
      })
    });
  }

  function initMockAuthService(): AuthService {
    return jasmine.createSpyObj('authService', {
      buildAuthHeader: cold('c-', {
        c: authHeader
      })
    });
  }

  function initTestService(): TestService {
    return new TestService(
      responseCache,
      requestService,
      rdbService,
      store,
      EnvConfig,
      cds,
      objectCache,
      halService,
      authService,
      notificationsService,
      http,
      LINK_NAME
    );
  }

  beforeEach(() => {
    cds = initMockCommunityDataService();
    requestService = getMockRequestService();
    objectCache = initMockObjectCacheService();
    responseCache = initMockResponseCacheService(true);
    halService = mockHalService;
    authService = initMockAuthService();
    service = initTestService();
  });

  describe('getScopedEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
    });

    it('should configure a new FindByIDRequest for the scope Community', () => {
      const expected = new FindByIDRequest(requestService.generateRequestId(), communityEndpoint, scopeID);

      scheduler.schedule(() => service.getScopedEndpoint(scopeID).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    describe('if the scope Community can be found', () => {
      it('should fetch the scope Community from the cache', () => {
        scheduler.schedule(() => service.getScopedEndpoint(scopeID).subscribe());
        scheduler.flush();
        expect(objectCache.getByUUID).toHaveBeenCalledWith(scopeID);
      });

      it('should return the endpoint to fetch resources within the given scope', () => {
        const result = service.getScopedEndpoint(scopeID);
        const expected = cold('--e-', { e: scopedEndpoint });

        expect(result).toBeObservable(expected);
      });
    });

    describe('if the scope Community can\'t be found', () => {
      beforeEach(() => {
        cds = initMockCommunityDataService();
        requestService = getMockRequestService();
        objectCache = initMockObjectCacheService();
        responseCache = initMockResponseCacheService(false);
        service = initTestService();
      });

      it('should throw an error', () => {
        const result = service.getScopedEndpoint(scopeID);
        const expected = cold('--#-', undefined, new Error(`The Community with scope ${scopeID} couldn't be retrieved`));

        expect(result).toBeObservable(expected);
      });
    });

  });

});
