import { SearchService } from '@core/shared/search/search.service';
import { of } from 'rxjs';

export function getMockSearchService(): SearchService {
  return jasmine.createSpyObj('searchService', {
    search: '',
    getEndpoint: of('discover/search/objects'),
    getSearchLink: '/mydspace',
    getScopes: of(['test-scope']),
    setServiceOptions: {},
  });
}
