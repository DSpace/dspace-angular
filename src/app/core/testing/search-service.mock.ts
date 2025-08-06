import { of } from 'rxjs';

import { SearchService } from '../../shared/search/search.service';

export function getMockSearchService(): SearchService {
  return jasmine.createSpyObj('searchService', {
    search: '',
    getEndpoint: of('discover/search/objects'),
    getSearchLink: '/mydspace',
    getScopes: of(['test-scope']),
    setServiceOptions: {},
  });
}
