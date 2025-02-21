import { of as observableOf } from 'rxjs';
import {
  skip,
  take,
} from 'rxjs/operators';

import { ExternalSource } from '../shared';
import { RelationshipOptions } from '../shared';
import { Item } from '../shared';
import { PageInfo } from '../shared';
import { PaginatedSearchOptions } from '../shared';
import { SearchResult } from '../shared';
import { SearchService } from '../shared';
import { createSuccessfulRemoteDataObject$ } from '../utilities';
import { createPaginatedList } from '../utilities';
import { ExternalSourceDataService } from '@dspace/core';
import { LookupRelationService } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import { RequestService } from '@dspace/core';

describe('LookupRelationService', () => {
  let service: LookupRelationService;
  let externalSourceService: ExternalSourceDataService;
  let searchService: SearchService;
  let requestService: RequestService;

  const totalExternal = 8;
  const optionsWithQuery = new PaginatedSearchOptions({ query: 'test-query' });
  const relationship = Object.assign(new RelationshipOptions(), {
    filter: 'test-filter',
    configuration: 'test-configuration',
  });
  const localResults = [
    Object.assign(new SearchResult(), {
      indexableObject: Object.assign(new Item(), {
        uuid: 'test-item-uuid',
        handle: 'test-item-handle',
      }),
    }),
  ];
  const externalSource = Object.assign(new ExternalSource(), {
    id: 'orcidV2',
    name: 'orcidV2',
    hierarchical: false,
  });
  const searchServiceEndpoint = 'http://test-rest.com/server/api/core/search';

  function init() {
    externalSourceService = jasmine.createSpyObj('externalSourceService', {
      getExternalSourceEntries: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
        elementsPerPage: 1,
        totalElements: totalExternal,
        totalPages: totalExternal,
        currentPage: 1,
      }), [{}])),
    });
    searchService = jasmine.createSpyObj('searchService', {
      search: createSuccessfulRemoteDataObject$(createPaginatedList(localResults)),
      getEndpoint: observableOf(searchServiceEndpoint),
    });
    requestService = jasmine.createSpyObj('requestService', ['removeByHrefSubstring']);
    service = new LookupRelationService(externalSourceService, searchService, requestService);
  }

  beforeEach(() => {
    init();
  });

  describe('getLocalResults', () => {
    let result;

    beforeEach(() => {
      result = service.getLocalResults(relationship, optionsWithQuery);
    });

    it('should return the local results', () => {
      result.subscribe((resultsRD) => {
        expect(resultsRD.payload.page).toBe(localResults);
      });
    });

    it('should set the searchConfig to contain a fixedFilter and configuration', () => {
      expect(service.searchConfig).toEqual(Object.assign(new PaginatedSearchOptions({}), optionsWithQuery,
        { fixedFilter: relationship.filter, configuration: relationship.searchConfiguration },
      ));
    });
  });

  describe('getTotalLocalResults', () => {
    let result;

    beforeEach(() => {
      result = service.getTotalLocalResults(relationship, optionsWithQuery);
    });

    it('should start with 0', () => {
      result.pipe(take(1)).subscribe((amount) => {
        expect(amount).toEqual(0);
      });
    });

    it('should return the correct total amount', () => {
      result.pipe(skip(1)).subscribe((amount) => {
        expect(amount).toEqual(localResults.length);
      });
    });

    it('should not set searchConfig', () => {
      expect(service.searchConfig).toBeUndefined();
    });
  });

  describe('getTotalExternalResults', () => {
    let result;

    beforeEach(() => {
      result = service.getTotalExternalResults(externalSource, optionsWithQuery);
    });

    it('should start with 0', () => {
      result.pipe(take(1)).subscribe((amount) => {
        expect(amount).toEqual(0);
      });
    });

    it('should return the correct total amount', () => {
      result.pipe(skip(1)).subscribe((amount) => {
        expect(amount).toEqual(totalExternal);
      });
    });
  });

  describe('removeLocalResultsCache', () => {
    beforeEach(() => {
      service.removeLocalResultsCache();
    });

    it('should call requestService\'s removeByHrefSubstring with the search endpoint', () => {
      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(searchServiceEndpoint);
    });
  });
});
