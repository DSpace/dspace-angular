import { of } from 'rxjs';

export function getMockSearchService() {
  return jasmine.createSpyObj('searchService', {
    search: '',
    getEndpoint: of('discover/search/objects'),
    getSearchLink: '/mydspace',
    getScopes: of(['test-scope']),
    setServiceOptions: {},
  });
}
