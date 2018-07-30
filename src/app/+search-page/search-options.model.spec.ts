import 'rxjs/add/observable/of';
import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SearchOptions } from './search-options.model';

describe('SearchOptions', () => {
  let options: PaginatedSearchOptions;
  const filters = { 'f.test': ['value'], 'f.example': ['another value', 'second value'] };
  const query = 'search query';
  const scope = '0fde1ecb-82cc-425a-b600-ac3576d76b47';
  const baseUrl = 'www.rest.com';
  beforeEach(() => {
    options = new SearchOptions();
    options.filters = filters;
    options.query = query;
    options.scope = scope;
  });

  describe('when toRestUrl is called', () => {

    it('should generate a string with all parameters that are present', () => {
      const outcome = options.toRestUrl(baseUrl);
      expect(outcome).toEqual('www.rest.com?' +
        'query=search query&' +
        'scope=0fde1ecb-82cc-425a-b600-ac3576d76b47&' +
        'f.test=value,query&' +
        'f.example=another value,query&' +
        'f.example=second value,query'
      );
    });

  });
});
