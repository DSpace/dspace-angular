import { SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';

export class SearchOptions {
  pagination?: PaginationComponentOptions;
  sort?: SortOptions;
}
