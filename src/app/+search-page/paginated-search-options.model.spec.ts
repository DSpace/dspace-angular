import 'rxjs/add/observable/of';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from './paginated-search-options.model';

describe('PaginatedSearchOptions', () => {
  let options: PaginatedSearchOptions;
  const sortOptions = new SortOptions('test.field', SortDirection.DESC);
  const pageOptions = Object.assign(new PaginationComponentOptions(), { pageSize: 40, page: 1 });
  const filters = { 'f.test': ['value'], 'f.example': ['another value', 'second value'] };
  const query = 'search query';
  const scope = '0fde1ecb-82cc-425a-b600-ac3576d76b47';
  const baseUrl = 'www.rest.com';
  beforeEach(() => {
    options = new PaginatedSearchOptions();
    options.sort = sortOptions;
    options.pagination = pageOptions;
    options.filters = filters;
    options.query = query;
    options.scope = scope;
  });

  describe('when toRestUrl is called', () => {

    it('should generate a string with all parameters that are present', () => {
      const outcome = options.toRestUrl(baseUrl);
      expect(outcome).toEqual('www.rest.com?' +
        'sort=test.field,DESC&' +
        'page=0&' +
        'size=40&' +
        'query=search query&' +
        'scope=0fde1ecb-82cc-425a-b600-ac3576d76b47&' +
        'f.test=value,query&' +
        'f.example=another value,query&' +
        'f.example=second value,query'
      );
    });

  });
});
