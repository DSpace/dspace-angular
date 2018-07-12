import { SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { isNotEmpty } from '../shared/empty.util';
import { SearchOptions } from './search-options.model';

export class PaginatedSearchOptions extends SearchOptions {
  pagination?: PaginationComponentOptions;
  sort?: SortOptions;
  toRestUrl(url: string, args: string[] = []): string {
    if (isNotEmpty(this.sort)) {
      args.push(`sort=${this.sort.field},${this.sort.direction}`);
    }
    if (isNotEmpty(this.pagination)) {
      args.push(`page=${this.pagination.currentPage - 1}`);
      args.push(`size=${this.pagination.pageSize}`);
    }
    return super.toRestUrl(url, args);
  }
}
