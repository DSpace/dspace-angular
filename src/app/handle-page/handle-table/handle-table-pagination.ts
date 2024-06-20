import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { getHandleTableModulePath } from '../handle-page-routing-paths';

export const paginationID = 'hdl';

export const defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: paginationID,
    currentPage: 1,
    pageSize: 10
  });

export const defaultSortConfiguration = new SortOptions('', SortDirection.DESC);

export function redirectBackWithPaginationOption(paginationService, currentPage = 0) {
  // for redirection use the paginationService because it redirects with pagination options
  paginationService.updateRouteWithUrl(paginationID,[getHandleTableModulePath()], {
    page: currentPage,
    pageSize: 10
  }, {
    handle: null,
    url: null,
    id: null,
    resourceType: null,
    resourceId: null,
    _selflink: null,
    currentPage: null
  });
}
