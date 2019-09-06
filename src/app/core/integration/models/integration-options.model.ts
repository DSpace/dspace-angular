import { SortOptions } from '../../cache/models/sort-options.model';
import { FindAllOptions } from '../../data/request.models';
import { SearchParam } from '../../cache/models/search-param.model';
import { isNotEmpty } from '../../../shared/empty.util';

export class IntegrationSearchOptions extends FindAllOptions {

  constructor(public uuid: string = '',
              public name: string = '',
              public metadata: string = '',
              public query: string = '',
              public elementsPerPage?: number,
              public currentPage?: number,
              public sort?: SortOptions) {
    super();
    this.searchParams = [];

    if (isNotEmpty(query)) {
      this.searchParams.push(new SearchParam('query', query));
    }

    if (isNotEmpty(metadata)) {
      this.searchParams.push(new SearchParam('metadata', metadata));
    }

    if (isNotEmpty(uuid)) {
      this.searchParams.push(new SearchParam('uuid', uuid));
    }

  }
}
