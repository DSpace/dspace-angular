import { of as observableOf } from 'rxjs';
import { SearchService } from '../../+search-page/search-service/search.service';

export function getMockSearchService(): SearchService {
  return jasmine.createSpyObj('searchService', {
    search: '',
    getEndpoint: observableOf('discover/search/objects'),
    getSearchLink: '/mydspace',
    getScopes: observableOf(['test-scope']),
    setServiceOptions: {}
  });
}
