import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable, of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { FindByIDRequest, FindListOptions } from './request.models';
import { RequestEntry } from './request.reducer';
import { RequestService } from './request.service';
import {createNoContentRemoteDataObject$, createSuccessfulRemoteDataObject$} from '../../shared/remote-data.utils';

const LINK_NAME = 'test';

class TestService extends ComColDataService<any> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
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

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    // implementation in subclasses for communities/collections
    return undefined;
  }
}

describe('ComColDataService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let requestService: RequestService;
  let cds: CommunityDataService;
  let objectCache: ObjectCacheService;
  let halService: any = {};

  const rdbService = {
    buildSingle : () => null
  } as any;
  const store = {} as Store<CoreState>;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;

  const scopeID = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const options = Object.assign(new FindListOptions(), {
    scopeID: scopeID
  });
  const getRequestEntry$ = (successful: boolean) => {
    return observableOf({
      response: { isSuccessful: successful } as any
    } as RequestEntry);
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
            [LINK_NAME]: {
              href: scopedEndpoint
            }
          }
        }
      })
    });
  }

  function initTestService(): TestService {
    return new TestService(
      requestService,
      rdbService,
      store,
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

    describe('cache refresh', () => {
      let communityWithoutParentHref;
      let data;

      beforeEach(() => {
        scheduler = getTestScheduler();
        halService = {
          getEndpoint: (linkPath) => 'https://rest.api/core/' + linkPath
        };
        service = initTestService();

      })
      describe('cache refreshed top level community', () => {
        beforeEach(() => {
          spyOn(rdbService, 'buildSingle').and.returnValue(createNoContentRemoteDataObject$());
          data = {
            dso: Object.assign(new Community(), {
              metadata: [{
                key: 'dc.title',
                value: 'top level community'
              }]
            }),
            _links: {
              parentCommunity: {
                href: 'topLevel/parentCommunity'
              }
            }
          };
          communityWithoutParentHref = {
            dso: Object.assign(new Community(), {
              metadata: [{
                key: 'dc.title',
                value: 'top level community'
              }]
            }),
            _links: {}
          };
        });
        it('top level community cache refreshed', () => {
          scheduler.schedule(() => (service as any).refreshCache(data));
          scheduler.flush();
          expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith('https://rest.api/core/communities/search/top');
        });
        it('top level community without parent link, cache not refreshed', () => {
          scheduler.schedule(() => (service as any).refreshCache(communityWithoutParentHref));
          scheduler.flush();
          expect(requestService.removeByHrefSubstring).not.toHaveBeenCalled();
        });
      });

      describe('cache refreshed child community', () => {
        beforeEach(() => {
          const parentCommunity = Object.assign(new Community(), {
            uuid: 'a20da287-e174-466a-9926-f66as300d399',
            id: 'a20da287-e174-466a-9926-f66as300d399',
            metadata: [{
              key: 'dc.title',
              value: 'parent community'
            }],
            _links: {}
          });
          spyOn(rdbService, 'buildSingle').and.returnValue(createSuccessfulRemoteDataObject$(parentCommunity));
          data = {
            dso: Object.assign(new Community(), {
              metadata: [{
                key: 'dc.title',
                value: 'child community'
              }]
            }),
            _links: {
              parentCommunity: {
                href: 'child/parentCommunity'
              }
            }
          };
        });
        it('child level community cache refreshed', () => {
          scheduler.schedule(() => (service as any).refreshCache(data));
          scheduler.flush();
          expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith('a20da287-e174-466a-9926-f66as300d399');
        });
      });
    });

  });

});
