import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SearchOptions } from './search-options.model';
import { SearchFilter } from './search-filter.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';

describe('SearchOptions', () => {
  let options: PaginatedSearchOptions;
  const filters = [new SearchFilter('f.test', ['value']), new SearchFilter('f.example', ['another value', 'second value'])];
  const query = 'search query';
  const scope = '0fde1ecb-82cc-425a-b600-ac3576d76b47';
  const baseUrl = 'www.rest.com';
  beforeEach(() => {
    options = new SearchOptions({ filters: filters, query: query, scope: scope , dsoType: DSpaceObjectType.ITEM});
  });

  describe('when toRestUrl is called', () => {

    it('should generate a string with all parameters that are present', () => {
      const outcome = options.toRestUrl(baseUrl);
      expect(outcome).toEqual('www.rest.com?' +
        'query=search query&' +
        'scope=0fde1ecb-82cc-425a-b600-ac3576d76b47&' +
        'dsoType=ITEM&' +
        'f.test=value&' +
        'f.example=another value&' +
        'f.example=second value'
      );
    });

  });
});
