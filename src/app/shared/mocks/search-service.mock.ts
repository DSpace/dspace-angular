import { of as observableOf } from 'rxjs';

import { SearchService } from '@dspace/core';

export function getMockSearchService(): SearchService {
  return jasmine.createSpyObj('searchService', {
    search: '',
    getEndpoint: observableOf('discover/search/objects'),
    getSearchLink: '/mydspace',
    getScopes: observableOf(['test-scope']),
    setServiceOptions: {},
  });
}
