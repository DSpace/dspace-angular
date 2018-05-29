import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/Rx';
import { getMockRemoteDataBuildService } from '../../shared/mocks/mock-remote-data-build.service';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { getMockResponseCacheService } from '../../shared/mocks/mock-response-cache.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { BrowseEndpointRequest, BrowseEntriesRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseService } from './browse.service';

describe('BrowseService', () => {
  let scheduler: TestScheduler;
  let service: BrowseService;
  let responseCache: ResponseCacheService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;

  const browsesEndpointURL = 'https://rest.api/browses';
  const halService: any = new HALEndpointServiceStub(browsesEndpointURL);
  const browseDefinitions = [
    Object.assign(new BrowseDefinition(), {
      id: 'date',
      metadataBrowse: false,
      sortOptions: [
        {
          name: 'title',
          metadata: 'dc.title'
        },
        {
          name: 'dateissued',
          metadata: 'dc.date.issued'
        },
        {
          name: 'dateaccessioned',
          metadata: 'dc.date.accessioned'
        }
      ],
      defaultSortOrder: 'ASC',
      type: 'browse',
      metadataKeys: [
        'dc.date.issued'
      ],
      _links: {
        self: 'https://rest.api/discover/browses/dateissued',
        items: 'https://rest.api/discover/browses/dateissued/items'
      }
    }),
    Object.assign(new BrowseDefinition(), {
      id: 'author',
      metadataBrowse: true,
      sortOptions: [
        {
          name: 'title',
          metadata: 'dc.title'
        },
        {
          name: 'dateissued',
          metadata: 'dc.date.issued'
        },
        {
          name: 'dateaccessioned',
          metadata: 'dc.date.accessioned'
        }
      ],
      defaultSortOrder: 'ASC',
      type: 'browse',
      metadataKeys: [
        'dc.contributor.*',
        'dc.creator'
      ],
      _links: {
        self: 'https://rest.api/discover/browses/author',
        entries: 'https://rest.api/discover/browses/author/entries',
        items: 'https://rest.api/discover/browses/author/items'
      }
    })
  ];

  function initMockResponseCacheService(isSuccessful: boolean) {
    const rcs = getMockResponseCacheService();
    (rcs.get as any).and.returnValue(cold('b-', {
      b: {
        response: {
          isSuccessful,
          payload: browseDefinitions,
        }
      }
    }));
    return rcs;
  }

  function initTestService() {
    return new BrowseService(
      responseCache,
      requestService,
      halService,
      rdbService
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
  });

  describe('getBrowseDefinitions', () => {

    beforeEach(() => {
      responseCache = initMockResponseCacheService(true);
      requestService = getMockRequestService();
      rdbService = getMockRemoteDataBuildService();
      service = initTestService();
      spyOn(halService, 'getEndpoint').and
        .returnValue(hot('--a-', { a: browsesEndpointURL }));
      spyOn(rdbService, 'toRemoteDataObservable').and.callThrough();
    });

    it('should configure a new BrowseEndpointRequest', () => {
      const expected = new BrowseEndpointRequest(requestService.generateRequestId(), browsesEndpointURL);

      scheduler.schedule(() => service.getBrowseDefinitions().subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should call RemoteDataBuildService to create the RemoteData Observable', () => {
      service.getBrowseDefinitions();

      expect(rdbService.toRemoteDataObservable).toHaveBeenCalled();

    });

    it('should return a RemoteData object containing the correct BrowseDefinition[]', () => {
      const expected = cold('--a-', { a: {
        payload: browseDefinitions
      }});

      expect(service.getBrowseDefinitions()).toBeObservable(expected);
    });

  });

  describe('getBrowseEntriesFor', () => {
    beforeEach(() => {
      responseCache = initMockResponseCacheService(true);
      requestService = getMockRequestService();
      rdbService = getMockRemoteDataBuildService();
      service = initTestService();
      spyOn(service, 'getBrowseDefinitions').and
        .returnValue(hot('--a-', { a: {
            payload: browseDefinitions
          }}));
      spyOn(rdbService, 'toRemoteDataObservable').and.callThrough();
    });

    describe('when called with a valid browse definition id', () => {
      it('should configure a new BrowseEntriesRequest', () => {
        const expected = new BrowseEntriesRequest(requestService.generateRequestId(), browseDefinitions[1]._links.entries);

        scheduler.schedule(() => service.getBrowseEntriesFor(browseDefinitions[1].id).subscribe());
        scheduler.flush();

        expect(requestService.configure).toHaveBeenCalledWith(expected);
      });

      it('should call RemoteDataBuildService to create the RemoteData Observable', () => {
        service.getBrowseEntriesFor(browseDefinitions[1].id);

        expect(rdbService.toRemoteDataObservable).toHaveBeenCalled();

      });

    });

    describe('when called with an invalid browse definition id', () => {
      it('should throw an Error', () => {

        const definitionID = 'invalidID';
        const expected = cold('--#-', undefined, new Error(`No metadata browse definition could be found for id '${definitionID}'`))

        expect(service.getBrowseEntriesFor(definitionID)).toBeObservable(expected);
      });
    });
  });

  describe('getBrowseURLFor', () => {

    describe('if getBrowseDefinitions fires', () => {
      beforeEach(() => {
        responseCache = initMockResponseCacheService(true);
        requestService = getMockRequestService();
        rdbService = getMockRemoteDataBuildService();
        service = initTestService();
        spyOn(service, 'getBrowseDefinitions').and
          .returnValue(hot('--a-', { a: {
              payload: browseDefinitions
            }}));
      });

      it('should return the URL for the given metadatumKey and linkPath', () => {
        const metadatumKey = 'dc.date.issued';
        const linkPath = 'items';
        const expectedURL = browseDefinitions[0]._links[linkPath];

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('c-d-', { c: undefined, d: expectedURL });

        expect(result).toBeObservable(expected);
      });

      it('should work when the definition uses a wildcard in the metadatumKey', () => {
        const metadatumKey = 'dc.contributor.author';  // should match dc.contributor.* in the definition
        const linkPath = 'items';
        const expectedURL = browseDefinitions[1]._links[linkPath];

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('c-d-', { c: undefined, d: expectedURL });

        expect(result).toBeObservable(expected);
      });

      it('should throw an error when the key doesn\'t match', () => {
        const metadatumKey = 'dc.title'; // isn't in the definitions
        const linkPath = 'items';

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('c-#-', { c: undefined }, new Error(`A browse endpoint for ${linkPath} on ${metadatumKey} isn't configured`));

        expect(result).toBeObservable(expected);
      });

      it('should throw an error when the link doesn\'t match', () => {
        const metadatumKey = 'dc.date.issued';
        const linkPath = 'collections'; // isn't in the definitions

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('c-#-', { c: undefined }, new Error(`A browse endpoint for ${linkPath} on ${metadatumKey} isn't configured`));

        expect(result).toBeObservable(expected);
      });

    });

    describe('if getBrowseDefinitions doesn\'t fire', () => {
      it('should return undefined', () => {
        responseCache = initMockResponseCacheService(true);
        requestService = getMockRequestService();
        rdbService = getMockRemoteDataBuildService();
        service = initTestService();
        spyOn(service, 'getBrowseDefinitions').and
          .returnValue(hot('----'));

        const metadatumKey = 'dc.date.issued';
        const linkPath = 'items';

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('b---', { b: undefined });
        expect(result).toBeObservable(expected);
      });
    });
  });
});
