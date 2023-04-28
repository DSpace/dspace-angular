import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';

/**
 * Pagination constants for the clarin license table
 */

export const paginationID = 'cLicense';

// pageSize: 200; get all licenses
export const defaultPagination = Object.assign(new PaginationComponentOptions(), {
  id: paginationID,
  currentPage: 1,
  pageSize: 10
});

export const defaultSortConfiguration = new SortOptions('', SortDirection.DESC);
