import { CollectionDataService } from './collection-data.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { Store } from '@ngrx/store';
import { GlobalConfig } from '../../../config';
import { CommunityDataService } from './community-data.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { FindByIDRequest } from './request.models';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { TestScheduler } from 'rxjs/Rx';

describe('CollectionDataService', () => {
  let scheduler: TestScheduler;
  let service: CollectionDataService;
  let responseCache: ResponseCacheService;
  let requestService: RequestService;
  let cds: CommunityDataService;
  let objectCache: ObjectCacheService;

  const rdbService = {} as RemoteDataBuildService;
  const store = {} as Store<CoreState>;
  const EnvConfig = {} as GlobalConfig;

  const scopeID = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const communitiesEndpoint = 'https://rest.api/core/communities';
  const communityEndpoint = `${communitiesEndpoint}/${scopeID}`;
  const scopedCollectionsEndpoint = `${communityEndpoint}/collections`;

  function initMockCommunityDataService(): CommunityDataService {
    return jasmine.createSpyObj('responseCache', {
      getEndpoint: hot('--a-', { a: communitiesEndpoint }),
      getFindByIDHref: cold('b-', { b: communityEndpoint })
    });
  }

  function initMockRequestService(): RequestService {
    return jasmine.createSpyObj('requestService', ['configure']);
  }

  function initMockResponceCacheService(isSuccessful: boolean): ResponseCacheService {
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
            collections: scopedCollectionsEndpoint
          }
        }
      })
    });
  }

  function initTestCollectionDataService(): CollectionDataService {
    return new CollectionDataService(
      responseCache,
      requestService,
      rdbService,
      store,
      EnvConfig,
      cds,
      objectCache
    );
  }

  describe('getScopedEndpoint', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
    });

    it('should configure a new FindByIDRequest for the scope Community', (done) => {
      cds = initMockCommunityDataService();
      requestService = initMockRequestService();
      objectCache = initMockObjectCacheService();
      responseCache = initMockResponceCacheService(true);
      service = initTestCollectionDataService();

      const expected = new FindByIDRequest(communityEndpoint, scopeID);

      scheduler.schedule(() => service.getScopedEndpoint(scopeID).subscribe());
      scheduler.flush();

      setTimeout(() => {
        expect(requestService.configure).toHaveBeenCalledWith(expected);
        done();
      }, 0);
    });

    describe('if the scope Community can be found', () => {
      beforeEach(() => {
        cds = initMockCommunityDataService();
        requestService = initMockRequestService();
        objectCache = initMockObjectCacheService();
        responseCache = initMockResponceCacheService(true);
        service = initTestCollectionDataService();
      });

      it('should fetch the scope Community from the cache', () => {
        scheduler.schedule(() => service.getScopedEndpoint(scopeID).subscribe());
        scheduler.flush();
        expect(objectCache.getByUUID).toHaveBeenCalledWith(scopeID, NormalizedCommunity);
      });

      it('should return the endpoint to fetch collections within the given scope', () => {
        const result = service.getScopedEndpoint(scopeID);
        const expected = cold('--e-', { e: scopedCollectionsEndpoint });

        expect(result).toBeObservable(expected);
      });
    });

    describe('if the scope Community can\'t be found', () => {
      beforeEach(() => {
        cds = initMockCommunityDataService();
        requestService = initMockRequestService();
        objectCache = initMockObjectCacheService();
        responseCache = initMockResponceCacheService(false);
        service = initTestCollectionDataService();
      });

      it('should throw an error', () => {
        const result = service.getScopedEndpoint(scopeID);
        const expected = cold('--#-', undefined, new Error(`The Community with scope ${scopeID} couldn't be retrieved`));

        expect(result).toBeObservable(expected);
      });
    });
  });
});
