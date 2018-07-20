import { SortOptions } from '../../cache/models/sort-options.model';

export class IntegrationSearchOptions {

  constructor(public uuid: string = '',
              public name: string = '',
              public metadata: string = '',
              public query: string = '',
              public elementsPerPage?: number,
              public currentPage?: number,
              public sort?: SortOptions) {

  }
}
