/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { SortDirection } from '../cache/models/sort-options.model';

export interface PaginationRouteParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortDirection?: SortDirection
}
