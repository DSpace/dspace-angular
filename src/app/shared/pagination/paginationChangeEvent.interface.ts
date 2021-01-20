import {PaginationComponentOptions} from './pagination-component-options.model';
import {SortOptions} from '../../core/cache/models/sort-options.model';

export interface PaginationChangeEvent {
  pagination: PaginationComponentOptions;
  sort: SortOptions;
}
