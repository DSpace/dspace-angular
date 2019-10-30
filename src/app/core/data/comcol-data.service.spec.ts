import { Store } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { GlobalConfig } from '../../../config';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { FindAllOptions, FindByIDRequest } from './request.models';
import { RequestService } from './request.service';
import { NormalizedObject } from '../cache/models/normalized-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestEntry } from './request.reducer';
import { of as observableOf } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { Item } from '../shared/item.model';
import { Community } from '../shared/community.model';

const LINK_NAME = 'test';

/* tslint:disable:max-classes-per-file */
class NormalizedTestObject extends NormalizedObject<Item> {
}

class TestService extends ComColDataService<any> {
  protected forceBypassCache = false;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected EnvConfig: GlobalConfig,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Community>,
    protected linkPath: string
  ) {
    super();
  }
}

/* tslint:enable:max-classes-per-file */

describe('ComColDataService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let requestService: RequestService;
  let cds: CommunityDataService;
  let objectCache: ObjectCacheService;
  let halService: any = {};

  const rdbService = {} as RemoteDataBuildService;
  const store = {} as Store<CoreState>;
  const EnvConfig = {} as GlobalConfig;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const dataBuildService = {} as NormalizedObjectBuildService;

  const scopeID = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const options = Object.assign(new FindAllOptions(), {
    scopeID: scopeID
  });
  const getRequestEntry$ = (successful: boolean) => {
    return observableOf({
      response: { isSuccessful: successful } as any
    } as RequestEntry)
  };

  const communitiesEndpoint = 'https://rest.api/core/communities';
  const communityEndpoint = `${communitiesEndpoint}/${scopeID}`;
  const scopedEndpoint = `${communityEndpoint}/${LINK_NAME}`;
  const serviceEndpoint = `https://rest.api/core/${LINK_NAME}`;
  const authHeader = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJlaWQiOiJhNjA4NmIzNC0zOTE4LTQ1YjctOGRkZC05MzI5YTcwMmEyNmEiLCJzZyI6W10sImV4cCI6MTUzNDk0MDcyNX0.RV5GAtiX6cpwBN77P_v16iG9ipeyiO7faNYSNMzq_sQ';

  const mockHalService = {
    getEndpoint: (linkPath) => observableOf(communitiesEndpoint)
  };

  function initMockCommunityDataService(): CommunityDataService {
    return jasmine.createSpyObj('responseCache', {
      getEndpoint: hot('--a-', { a: communitiesEndpoint }),
      getIDHref: communityEndpoint
    });
  }

  function initMockObjectCacheService(): ObjectCacheService {
    return jasmine.createSpyObj('objectCache', {
      getObjectByUUID: cold('d-', {
        d: {
          _links: {
            [LINK_NAME]: scopedEndpoint
          }
        }
      })
    });
  }

  function initTestService(): TestService {
    return new TestService(
      requestService,
      rdbService,
      dataBuildService,
      store,
      EnvConfig,
      cds,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator,
      LINK_NAME
    );
  }

  beforeEach(() => {
    cds = initMockCommunityDataService();
    requestService = getMockRequestService();
    objectCache = initMockObjectCacheService();
    halService = mockHalService;
    service = initTestService();
  });

  describe('getBrowseEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
    });

    it('should configure a new FindByIDRequest for the scope Community', () => {
      cds = initMockCommunityDataService();
      requestService = getMockRequestService(getRequestEntry$(true));
      objectCache = initMockObjectCacheService();
      service = initTestService();

      const expected = new FindByIDRequest(requestService.generateRequestId(), communityEndpoint, scopeID);

      scheduler.schedule(() => service.getBrowseEndpoint(options).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    describe('if the scope Community can be found', () => {
      beforeEach(() => {
        cds = initMockCommunityDataService();
        requestService = getMockRequestService(getRequestEntry$(true));
        objectCache = initMockObjectCacheService();
        service = initTestService();
      });

      it('should fetch the scope Community from the cache', () => {
        scheduler.schedule(() => service.getBrowseEndpoint(options).subscribe());
        scheduler.flush();
        expect(objectCache.getObjectByUUID).toHaveBeenCalledWith(scopeID);
      });

      it('should return the endpoint to fetch resources within the given scope', () => {
        const result = service.getBrowseEndpoint(options);
        const expected = '--e-';

        scheduler.expectObservable(result).toBe(expected, { e: scopedEndpoint });
      });
    });

    describe('if the scope Community can\'t be found', () => {
      beforeEach(() => {
        cds = initMockCommunityDataService();
        requestService = getMockRequestService(getRequestEntry$(false));
        objectCache = initMockObjectCacheService();
        service = initTestService();
      });

      it('should throw an error', () => {
        const result = service.getBrowseEndpoint(options);
        const expected = cold('--#-', undefined, new Error(`The Community with scope ${scopeID} couldn't be retrieved`));

        expect(result).toBeObservable(expected);
      });
    });

  });

});
