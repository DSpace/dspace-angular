import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { getMockResponseCacheService } from '../../shared/mocks/mock-response-cache.service';
import { BrowseService } from './browse.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RequestService } from '../data/request.service';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseEndpointRequest } from '../data/request.models';
import { TestScheduler } from 'rxjs/Rx';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';

describe('BrowseService', () => {
  let scheduler: TestScheduler;
  let service: BrowseService;
  let responseCache: ResponseCacheService;
  let requestService: RequestService;

  const browsesEndpointURL = 'https://rest.api/browses';
  const halService: any = new HALEndpointServiceStub(browsesEndpointURL);
  const browseDefinitions = [
    Object.assign(new BrowseDefinition(), {
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
          browseDefinitions,
        }
      }
    }));
    return rcs;
  }

  function initTestService() {
    return new BrowseService(
      responseCache,
      requestService,
      halService
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
  });

  describe('getBrowseURLFor', () => {

    describe('if getEndpoint fires', () => {
      beforeEach(() => {
        responseCache = initMockResponseCacheService(true);
        requestService = getMockRequestService();
        service = initTestService();
        spyOn(halService, 'getEndpoint').and
          .returnValue(hot('--a-', { a: browsesEndpointURL }));
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

      it('should configure a new BrowseEndpointRequest', () => {
        const metadatumKey = 'dc.date.issued';
        const linkPath = 'items';
        const expected = new BrowseEndpointRequest(requestService.generateRequestId(), browsesEndpointURL);

        scheduler.schedule(() => service.getBrowseURLFor(metadatumKey, linkPath).subscribe());
        scheduler.flush();

        expect(requestService.configure).toHaveBeenCalledWith(expected);

      });

    });

    describe('if getEndpoint doesn\'t fire', () => {
      it('should return undefined', () => {
        responseCache = initMockResponseCacheService(true);
        requestService = getMockRequestService();
        service = initTestService();
        spyOn(halService, 'getEndpoint').and
          .returnValue(hot('----'));

        const metadatumKey = 'dc.date.issued';
        const linkPath = 'items';

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('b---', { b: undefined });
        expect(result).toBeObservable(expected);
      });
    });

    describe('if the browses endpoint can\'t be retrieved', () => {
      it('should throw an error', () => {
        responseCache = initMockResponseCacheService(false);
        requestService = getMockRequestService();
        service = initTestService();
        spyOn(halService, 'getEndpoint').and
          .returnValue(hot('--a-', { a: browsesEndpointURL }));

        const metadatumKey = 'dc.date.issued';
        const linkPath = 'items';

        const result = service.getBrowseURLFor(metadatumKey, linkPath);
        const expected = cold('c-#-', { c: undefined }, new Error(`Couldn't retrieve the browses endpoint`));
        expect(result).toBeObservable(expected);
      });
    });
  });
});
