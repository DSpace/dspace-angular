import { SortOptions } from '../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';

export enum ViewMode {
  List = 'list',
  Grid = 'grid'
}

export class SearchOptions {
  pagination?: PaginationComponentOptions;
  sort?: SortOptions;
  view?: ViewMode = ViewMode.List;
}
